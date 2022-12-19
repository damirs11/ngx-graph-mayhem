import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomLayout} from "./custom-example";
import {DagreNodesOnlySettings} from "../lib/graph/layouts/dagreNodesOnly";
import {Edge, Node} from "../lib/models";
import {GraphComponent} from "../lib/graph/graph.component";
import {Subject} from "rxjs";
import {data, Direction, EdgeData} from "./data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'ngx-graph-org-tree',
  templateUrl: './ngx-graph-org-tree.html',
  styleUrls: ['./ngx-graph-org-tree.scss']
})
export class NgxGraphOrgTreeComponent implements OnInit {
  @ViewChild('graph') graph!: GraphComponent;

  formNode: FormGroup = new FormGroup({});
  formEdge: FormGroup = new FormGroup({});
  direction = data.dirs;

  nodes: Node[] = [];
  links: Edge[] = [];
  layout = new CustomLayout();
  settings: DagreNodesOnlySettings = {}
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder) {
    for (const nodeData of data.nodes) {
      this.nodes.push(this.formatNodeDataToNode(nodeData));
    }
    for (const edgeData of data.edges) {
      this.links.push(this.formatEdgeDataToEdge(edgeData));
    }
  }

  public ngOnInit(): void {
    this.center$.next(true);
    this.zoomToFit$.next(true);

    this.formNode = this.fb.group({
      id: [""],
      middleware: [false],
      connections: [""],
      parent: [""]
    });

    this.formEdge = this.fb.group({
      source: [""],
      target: [""],
      start: [""],
      end: [""]
    });
  }

  _switch = true;

  switch() {
    this._switch = !this._switch;
  }

  async printNodeDataToConsole() {
    if (!this.graph) {
      return;
    }
    let links: any[] = [];
    this.graph.links.forEach(link => {
      links.push({
        source: link.source,
        target: link.target,
        direction: {
          start: link.data.direction.start,
          end: link.data.direction.end
        }
      })
    });
    console.log('edge data', links);
    let nodes: any[] = [];
    this.graph.nodes.forEach(node => {
      nodes.push({
        id: node.id,
        position: node.position,
        middleware: node.data.middleware,
        connections: node.data.connections
      });
    });
    console.log('node data', nodes);

    let res = `const nodes: NodeData[] = ${JSON.stringify(nodes)}; const edges: EdgeData[] = ${JSON.stringify(links)}`;
    console.log(res);
    await navigator.clipboard.writeText(res);
  }

  getNodes() {
    if (!this.graph) return [];
    return this.graph.nodes.map(node => node.id).sort((a, b) => a.localeCompare(b))
  }

  addNode(value: any) {
    console.log(value);
    if (!value.connections || value.connections.length === 0) {
      value.connections = [];
    } else {
      value.connections = value.connections.filter((string: string) => string.length > 0).split(",");
    }
    this.nodes.push(this.formatNodeDataToNode(value));
    this.update$.next(true);
  }

  addEdge(value: any) {
    const edge: EdgeData = {
      source: value.source,
      target: value.target,
      direction: {
        start: value.start,
        end: value.end
      }
    }
    console.log(edge);
    this.links.push(this.formatEdgeDataToEdge(edge));
    this.update$.next(true);
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

  removeNode(node: Node) {
    this.links = this.links.filter(link => link.target !== node.id && link.source !== node.id);
    this.nodes = this.nodes.filter(n => n.id !== node.id);
    this.update$.next(true);
  }

  removeLink(link: Edge) {
    this.links = this.links.filter(l => l.id !== link.id);
    this.update$.next(true);
  }

  getMiddle(link: any, axis: 'x' | 'y', offset: any) {
    const points = link.points;
    if (!points) {
      return 0;
    }
    let result = 0;
    const offsetMiddle = offset / 2;
    for (let point of points) {
      result = (result + point[axis] - offsetMiddle)
    }
    return result / points.length;
  }

  swapSourceTarget() {
    let source = this.formEdge.get('source')?.value;
    let target = this.formEdge.get('target')?.value;
    let formCopy = {
      ...this.formEdge.getRawValue(),
      source: target,
      target: source
    };
    this.formEdge.setValue(formCopy);
  }
}
