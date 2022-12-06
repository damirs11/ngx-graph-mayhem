import {Graph} from "../lib/models";
import {DagreNodesOnlyLayout} from "../lib/graph/layouts/dagreNodesOnly";
import {DagreLayout} from "../lib/graph/layouts/dagre";

export class CustomLayout extends DagreLayout {
  override run(graph: Graph): Graph {
    this.createDagreGraph(graph);
    // dagre.layout(this.dagreGraph);
    graph.edges.forEach((edge) => this.updateEdge(graph, edge)); // edges have to be computed
    graph.edgeLabels = this.dagreGraph._edgeLabels;

    for (const dagreNodeId in this.dagreGraph._nodes) {
      const dagreNode = this.dagreGraph._nodes[dagreNodeId];
      const node = graph.nodes.find((n) => n.id === dagreNode.id);
      node!.position = {
        x: dagreNode.x,
        y: dagreNode.y,
      };
      node!.dimension = {
        width: dagreNode.width,
        height: dagreNode.height,
      };
    }

    return graph;
  }
}
