import { Layout } from '../../models/layout.model';
import { Graph } from '../../models/graph.model';
import { id } from '../../utils/id';
import { Edge } from '../../models/edge.model';
import { DagreSettings, Orientation } from './dagre';
import * as dagre from 'dagre';

export interface DagreNodesOnlySettings extends DagreSettings {
  curveDistance?: number;
}

const DEFAULT_EDGE_NAME = '\x00';
const GRAPH_NODE = '\x00';
const EDGE_KEY_DELIM = '\x01';

export class DagreNodesOnlyLayout implements Layout {
  defaultSettings: DagreNodesOnlySettings = {
    orientation: Orientation.LEFT_TO_RIGHT,
    marginX: 20,
    marginY: 20,
    edgePadding: 100,
    rankPadding: 100,
    nodePadding: 50,
    curveDistance: 20,
    multigraph: true,
    compound: true
  };
  settings: any;

  dagreGraph: any;
  dagreNodes: any;
  dagreEdges: any;

  run(graph: Graph): Graph {
    this.createDagreGraph(graph);
    // dagre.layout(this.dagreGraph);

    graph.edgeLabels = this.dagreGraph._edgeLabels;

    for (const dagreNodeId in this.dagreGraph._nodes) {
      const dagreNode = this.dagreGraph._nodes[dagreNodeId];
      const node = graph.nodes.find(n => n.id === dagreNode.id);
      // @ts-ignore
      node.position = {
        x: dagreNode.x,
        y: dagreNode.y
      };
      // @ts-ignore
      node.dimension = {
        width: dagreNode.width,
        height: dagreNode.height
      };
    }
    for (const edge of graph.edges) {
      this.updateEdge(graph, edge);
    }

    return graph;
  }

  updateEdge(graph: Graph, edge: Edge): Graph {
    const sourceNode = graph.nodes.find(n => n.id === edge.source);
    const targetNode = graph.nodes.find(n => n.id === edge.target);
    const rankAxis: 'x' | 'y' = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x';
    const orderAxis: 'x' | 'y' = rankAxis === 'y' ? 'x' : 'y';
    const rankDimension = rankAxis === 'y' ? 'height' : 'width';
    // determine new arrow position
    // @ts-ignore
    const dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
    const startingPoint = {
    // @ts-ignore
      [orderAxis]: sourceNode.position[orderAxis],
    // @ts-ignore
      [rankAxis]: sourceNode.position[rankAxis] - dir * (sourceNode.dimension[rankDimension] / 2)
    };
    const endingPoint = {
    // @ts-ignore
      [orderAxis]: targetNode.position[orderAxis],
    // @ts-ignore
      [rankAxis]: targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2)
    };

    const curveDistance = this.settings.curveDistance || this.defaultSettings.curveDistance;
    // generate new points
    edge.points = [
      startingPoint,
      {
        [orderAxis]: startingPoint[orderAxis],
    // @ts-ignore
        [rankAxis]: startingPoint[rankAxis] - dir * curveDistance
      },
      {
        [orderAxis]: endingPoint[orderAxis],
        // @ts-ignore
        [rankAxis]: endingPoint[rankAxis] + dir * curveDistance
      },
      endingPoint
    ];
    const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;
    const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
    if (matchingEdgeLabel) {
      matchingEdgeLabel.points = edge.points;
    }
    return graph;
  }

  createDagreGraph(graph: Graph): any {
    const settings = Object.assign({}, this.defaultSettings, this.settings);
    this.dagreGraph = new dagre.graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
    this.dagreGraph.setGraph({
      rankdir: settings.orientation,
      marginx: settings.marginX,
      marginy: settings.marginY,
      edgesep: settings.edgePadding,
      ranksep: settings.rankPadding,
      nodesep: settings.nodePadding,
      align: settings.align,
      acyclicer: settings.acyclicer,
      ranker: settings.ranker,
      multigraph: settings.multigraph,
      compound: settings.compound
    });

    // Default to assigning a new object as a label for each new edge.
    this.dagreGraph.setDefaultEdgeLabel(() => {
      return {
        /* empty */
      };
    });

    this.dagreNodes = graph.nodes.map(n => {
      const node: any = Object.assign({}, n);
      // @ts-ignore
      node.width = n.dimension.width;
      // @ts-ignore
      node.height = n.dimension.height;
      // @ts-ignore
      node.x = n.position.x;

      // @ts-ignore
      node.y = n.position.y;
      return node;
    });

    this.dagreEdges = graph.edges.map(l => {
      const newLink: any = Object.assign({}, l);
      if (!newLink.id) {
        newLink.id = id();
      }
      return newLink;
    });

    for (const node of this.dagreNodes) {
      if (!node.width) {
        node.width = 20;
      }
      if (!node.height) {
        node.height = 30;
      }

      // update dagre
      this.dagreGraph.setNode(node.id, node);
    }

    // update dagre
    for (const edge of this.dagreEdges) {
      if (settings.multigraph) {
        this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
      } else {
        this.dagreGraph.setEdge(edge.source, edge.target);
      }
    }

    return this.dagreGraph;
  }
}
