import * as dagre from "dagre";
import {id} from "../lib/utils/id";
import {DagreNodesOnlyLayout} from "../lib/graph/layouts/dagreNodesOnly";
import {Edge, Graph, Node} from "../lib/models";

const DEFAULT_EDGE_NAME = '\x00';
const GRAPH_NODE = '\x00';
const EDGE_KEY_DELIM = '\x01';

export class CustomLayout extends DagreNodesOnlyLayout {
  graph!: Graph;

  override run(graph: Graph): Graph {
    this.createDagreGraph(graph);
    this.graph = graph;
    // dagre.layout(this.dagreGraph);

    graph.edgeLabels = this.dagreGraph._edgeLabels;

    for (const dagreNodeId in this.dagreGraph._nodes) {
      const dagreNode = this.dagreGraph._nodes[dagreNodeId];
      const node = graph.nodes.find(n => n.id === dagreNode.id);
      node!.position = {
        x: dagreNode.x,
        y: dagreNode.y
      };
      node!.dimension = {
        width: dagreNode.width,
        height: dagreNode.height
      };
    }
    for (const edge of graph.edges) {
      this.updateEdge(graph, edge);
    }

    return graph;
  }

  override updateEdge(graph: Graph, edge: Edge): Graph {
    const sourceNode = graph.nodes!.find(n => n.id === edge.source) as Required<Node>;
    const targetNode = graph.nodes!.find(n => n.id === edge.target) as Required<Node>;

    edge.points = this.directedUpdateEdge(sourceNode, targetNode, edge.data.direction);

    const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;
    const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
    if (matchingEdgeLabel) {
      matchingEdgeLabel.points = edge.points;
    }
    return graph;
  }

  directedUpdateEdge(sourceNode: Required<Node>, targetNode: Required<Node>, direction: any): any[] {
    const x = Math.abs(sourceNode.position.x - targetNode.position.x);
    const y = Math.abs(sourceNode.position.y - targetNode.position.y);
    let startingPoint = {
      x: sourceNode.position.x + direction.start.x * (sourceNode.dimension.width / 2),
      y: sourceNode.position.y + direction.start.y * (sourceNode.dimension.height / 2)
    };
    let endingPoint = {
      x: targetNode.position.x + direction.end.x * (targetNode.dimension.width / 2),
      y: targetNode.position.y + direction.end.y * (targetNode.dimension.height / 2)
    };
    return [startingPoint, endingPoint];
  }

  override createDagreGraph(graph: Graph): any {
    const settings = Object.assign({}, this.defaultSettings, this.settings);
    this.dagreGraph = new dagre.graphlib.Graph({compound: settings.compound, multigraph: settings.multigraph});
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
      node.width = n.dimension!.width;
      node.height = n.dimension!.height;
      node.x = n.position!.x;
      node.y = n.position!.y;
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

  onDragEnd(draggingNode: Node, $event: MouseEvent): void {
    if (!draggingNode || !this.graph || !($event.target instanceof HTMLTableCellElement)) {
      return;
    }

    let nodeX = draggingNode.position!.x - draggingNode.position!.x % this.settings.nodeWidth;
    let nodeY = draggingNode.position!.y - draggingNode.position!.y % this.settings.nodeHeight;


    nodeX = nodeX < 0 ? 0 : nodeX;
    nodeY = nodeY < 0 ? 0 : nodeY;

    // nodeX = nodeX - draggingNode.dimension!.width / 2
    // nodeY = nodeY - draggingNode.dimension!.height / 2
    // console.log(nodeX, nodeY, $event);

    // draggingNode.transform = `translate(${nodeX}, ${nodeY})`;
    this.graph.nodes.map(n => {
      if (n.id === draggingNode.id) {
        n.position = {x: nodeX, y: nodeY};
        n.transform = `translate(${nodeX}, ${nodeY})`;
      }
      return n;
    });
  }
}

