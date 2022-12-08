import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomLayout} from "./custom-example";
import {DagreNodesOnlySettings} from "../lib/graph/layouts/dagreNodesOnly";
import {Edge, Node} from "../lib/models";
import {GraphComponent} from "../lib/graph/graph.component";

export interface Station {
  id: string,
  position: {
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

  constructor() {
    const coords: any = { "МСК": { "x": 734.9390878481788, "y": 813.2687480869295 }, "ОКТ": { "x": 737.0609121518207, "y": 244.5079073563919 }, "МСКОКТ": { "x": 736, "y": 535 }, "СЕВ": { "x": 1567.3254769921436, "y": 245.52861952861826 }, "МСКСЕВ": { "x": 1219.139169472502, "y": 541.3479236812561 }, "ГОР": { "x": 1578.8751714677603, "y": 807.9561042523998 }, "МСКГОР": { "x": 1203.0178326474584, "y": 810.6995884773664 } };
    this.stations = [
      {
        id: 'МСК',
        connectedWith: [],
        position: {
          x: 0,
          y: 0
        }

      },
      {
        id: 'ОКТ',
        connectedWith: [],
        position: {
          x: 10,
          y: 10
        }
      },
      {
        id: 'МСКОКТ',
        connectedWith: ['МСК', 'ОКТ'],
        middleware: true,
        connections: ['Поворово 1', 'Савелово', 'Ховрино', 'Шаховская', 'Осуга'],
        position: {
          x: 10,
          y: 10
        }
      },

      {
        id: 'СЕВ',
        connectedWith: [],
        position: {
          x: 10,
          y: 10
        }
      },
      {
        id: 'МСКСЕВ',
        connectedWith: ['МСК', 'СЕВ'],
        middleware: true,
        connections: ['Александрово'],
        position: {
          x: 10,
          y: 10
        },
      },

      {
        id: 'ГОР',
        connectedWith: [],
        position: {
          x: 10,
          y: 10
        }
      },
      {
        id: 'МСКГОР',
        connectedWith: ['МСК', 'ГОР'],
        middleware: true,
        connections: ['Петушки', 'Черусти'],
        position: {
          x: 10,
          y: 10
        },
      }
    ];
    this.stations = this.stations.map(station => {
      station.position = coords[station.id];
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
