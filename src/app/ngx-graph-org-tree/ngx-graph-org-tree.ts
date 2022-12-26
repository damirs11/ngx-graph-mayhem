import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Edge, Node} from "../lib/models";
import {GraphComponent} from "../lib/graph/graph.component";
import {Subject} from "rxjs";
import {data, EdgeData} from "./data";
import {FormBuilder, FormGroup} from "@angular/forms";
import {select} from "d3-selection";
import {range} from "d3-array";
import {CustomLayout} from "./custom-layout";

@Component({
  selector: 'ngx-graph-org-tree',
  templateUrl: './ngx-graph-org-tree.html',
  styleUrls: ['./ngx-graph-org-tree.scss']
})
export class NgxGraphOrgTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('graph') graph!: GraphComponent;

  formNode: FormGroup = new FormGroup({});
  formEdge: FormGroup = new FormGroup({});
  direction = data.dirs;
  isHidden = false;

  nodes: Node[] = [];
  links: Edge[] = [];
  layout = new CustomLayout();
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

  ngAfterViewInit() {
    this.showGrid();
  }

  settings = {
    width: 10000,
    height: 10000,
    nodeWidth: 150,
    nodeHeight: 150
  }

  showGrid() {
    const width = this.settings.width,
      height = this.settings.height,
      xStepsBig = range(0, width, this.settings.nodeWidth),
      yStepsBig = range(0, height, this.settings.nodeHeight),
      xStepsSmall = range(0, width, this.settings.nodeWidth),
      yStepsSmall = range(0, height, this.settings.nodeHeight);


    const graph = select(".chart");
    graph.insert("g", ":first-child")
      .attr("class", "grid")
    const grid = select(".grid");

    grid.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    grid.selectAll(".x")
      .data(xStepsBig)
      .enter().append("path")
      .attr("class", "x")
      .datum(function (x) {
        return yStepsSmall.map(function (y) {
          return [x, y];
        });
      });

    grid.selectAll(".y")
      .data(yStepsBig)
      .enter().append("path")
      .attr("class", "y")
      .datum(function (y) {
        return xStepsSmall.map(function (x) {
          return [x, y];
        });
      });
  }

  hideGrid() {
    const grid = select(".grid");
    grid.remove();
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

  swapDirections() {
    let start = this.formEdge.get('start')?.value;
    let end = this.formEdge.get('end')?.value;
    let formCopy = {
      ...this.formEdge.getRawValue(),
      start: end,
      end: start
    };
    this.formEdge.setValue(formCopy);
  }

  hideControls() {
    this.isHidden = !this.isHidden;
  }
}
