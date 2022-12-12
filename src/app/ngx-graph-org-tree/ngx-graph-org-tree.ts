import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomLayout} from "./custom-example";
import {DagreNodesOnlySettings} from "../lib/graph/layouts/dagreNodesOnly";
import {Edge, Node} from "../lib/models";
import {GraphComponent} from "../lib/graph/graph.component";
import {stations, coords} from "./data";
import {Subject} from "rxjs";
import {curveLinear} from "d3-shape";

export interface Station {
  id: string,
  position?: {
    x: number,
    y: number,
  }
  connectedWith?: string[],
  middleware?: boolean,
  connections?: string[]
}

@Component({
  selector: 'ngx-graph-org-tree',
  templateUrl: './ngx-graph-org-tree.html',
  styleUrls: ['./ngx-graph-org-tree.scss']
})
export class NgxGraphOrgTreeComponent implements OnInit {
  @Input() stations: Station[] = [];
  @ViewChild('graph') graph!: GraphComponent;

  nodes: Node[] = [];
  links: Edge[] = [];
  layout = new CustomLayout();
  settings: DagreNodesOnlySettings = {}
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  constructor() {
    const coordsData = coords;
    this.stations = stations;
    this.stations = this.stations.map(station => {
      station.position = coordsData[station.id];
      return station;
    })

    console.log(this.stations);

    for (const station of this.stations) {
      const node: Node = {
        id: station.id,
        label: station.id,
        position: station.position,
        data: {
          middleware: station?.middleware ?? false,
          connections: station?.connections ?? []
        }
      };
      this.nodes.push(node);
    }

    for (const station of this.stations) {
      if (!station.connectedWith) {
        continue;
      }

      station.connectedWith.forEach(connectionId => {
        const edge: Edge = {
          source: connectionId,
          target: station.id,
          label: `${connectionId} - ${station.id}`,
        };
        this.links.push(edge);
      })
    }
  }

  public ngOnInit(): void {
    this.center$.next(true);
    this.zoomToFit$.next(true);
  }

  _switch = true;

  switch() {
    this._switch = !this._switch;
  }

  getMiddle(link: any, axis: 'x' | 'y', offset: any) {
    // if(!link || !link.midPoint || !link.midPoint[axis]) {
    //   return 0;
    // }
    // return link.midPoint[axis] - offset / 2;

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

  getNodes() {
    if (!this.graph) {
      return;
    }
    let res: any = {};
    this.graph.nodes.forEach(node => {
      res[node.id] = node.position;
    });
    return res;
  }
}
