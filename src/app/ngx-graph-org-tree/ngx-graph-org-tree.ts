import {Component, Input, OnInit} from '@angular/core';
import {Edge, Node} from "@local/ngx-graph";
import {DagreNodesOnlyLayout} from "./custom-example";

export interface Station {
  id: string,
  pr: number,
  sd: number,
  rr: number,
  delta: number,
  x?: number,
  y?: number,
  connectedWith?: string[],
  childNode?: boolean,
}

@Component({
  selector: 'ngx-graph-org-tree',
  templateUrl: './ngx-graph-org-tree.html',
  styleUrls: ['./ngx-graph-org-tree.scss']
})
export class NgxGraphOrgTreeComponent implements OnInit {
  @Input() stations: Station[] = [];

  nodes: Node[] = [];
  links: Edge[] = [];
  layout = new DagreNodesOnlyLayout();
  // settings: ColaForceDirectedSettings = {
  //   force: undefined
  // }

  constructor() {
    this.stations = [
      {
        id: 'МСК',
        connectedWith: [],
        rr: 1,
        pr: 2,
        sd: 3,
        delta: 0,
        x: 1,
        y: 1,
      },
      {
        id: 'ОКТ',
        connectedWith: ['МСК'],
        rr: 1,
        pr: 2,
        sd: 3,
        delta: 0,
        x: 10,
        y: 10,
      },
      {
        id: 'ЮВС',
        connectedWith: ['МСК'],
        rr: 1,
        pr: 2,
        sd: 3,
        delta: 0,
        x: -10,
        y: 10
      },
    ];

    for (const station of this.stations) {
      const node: Node = {
        id: station.id,
        label: station.id,
        position: {
          x: (station?.x ?? 1) * 50,
          y: (station?.y ?? 1) * 50
        },
        data: {
          rr: station.rr,
          pr: station.pr,
          sd: station.sd,
          delta: station.delta,
        }
      };
      console.log(node.position)
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
          data: {
            childNode: station.childNode
          }
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
    return (link.points[0]['x'] + link.points[1]['x'] - offset) / 2
  }
}
