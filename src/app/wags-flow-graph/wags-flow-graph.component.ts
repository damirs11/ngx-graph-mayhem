import {Component, OnInit, ViewChild} from '@angular/core';
import {GraphComponent} from "./lib/graph/graph.component";
import {Edge, Node} from "./lib/models";
import {Subject} from "rxjs";
import {CustomLayout} from "./custom-layout";
import {data} from "./data";

@Component({
  selector: 'prg-wags-flow-graph',
  templateUrl: './wags-flow-graph.component.html',
  styleUrls: ['./wags-flow-graph.component.scss'],
})
export class WagsFlowGraphComponent implements OnInit {
  @ViewChild('graph') graph!: GraphComponent;

  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  nodes: Node[] = [];
  links: Edge[] = [];
  layout = new CustomLayout();

  constructor() {
    for (const nodeData of data.nodes) {
      this.nodes.push(this.formatNodeDataToNode(nodeData));
    }
    for (const edgeData of data.edges) {
      this.links.push(this.formatEdgeDataToEdge(edgeData));
    }
  }

  ngOnInit(): void {
    this.zoomToFit$.next(true);
    this.center$.next(true);
  }

  formatNodeDataToNode(nodeData: any) {
    const node: Node = {
      id: nodeData.id,
      label: nodeData.id,
      position: nodeData.position,
      data: {
        middleware: nodeData?.middleware ?? false,
        connections: nodeData?.connections ?? []
      }
    };
    return node;
  }

  formatEdgeDataToEdge(edgeData: any) {
    const edge: Edge = {
      id: `${edgeData.source}${edgeData.target}`,
      source: edgeData.source,
      target: edgeData.target,
      label: `${edgeData.source} - ${edgeData.target}`,
      data: {
        direction: {
          start: edgeData?.direction?.start,
          end: edgeData?.direction?.end
        }
      }
    };
    return edge;
  }
}
