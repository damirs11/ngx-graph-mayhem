import {Directive, Host, Optional, Self} from "@angular/core";
import {Subscription} from "rxjs";
import {GraphComponent} from "@local/ngx-graph";

const cache: Record<string, boolean> = {};

function id(): string {
  let newId = (
    '0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
  ).slice(-4);

  newId = `a${newId}`;

  // ensure not already used
  // @ts-ignore
  if (!cache[newId]) {
    // @ts-ignore
    cache[newId] = true;
    return newId;
  }

  return id();
}

@Directive({
  selector: '[customGraph]',
})
export class CustomGraphDirective {
  constructor(@Host() @Self() @Optional() public hostSel: GraphComponent) {
    // overwrite custom graph
    hostSel.createGraph = () => {
      hostSel.graphSubscription.unsubscribe();
      hostSel.graphSubscription = new Subscription();
      const initializeNode = (n: any) => {
        if (!n.meta) {
          n.meta = {};
        }
        if (!n.id) {
          n.id = id();
        }
        if (!n.dimension) {
          n.dimension = {
            width: hostSel.nodeWidth ? hostSel.nodeWidth : 30,
            height: hostSel.nodeHeight ? hostSel.nodeHeight : 30,
          };
          n.meta.forceDimensions = false;
        } else {
          n.meta.forceDimensions =
            n.meta.forceDimensions === undefined
              ? true
              : n.meta.forceDimensions;
        }
        console.log(n.position);
        if (!n.position) {
          n.position = {
            x: 0,
            y: 0,
          };
        }

        n.data = n.data ? n.data : {};
        return n;
      };
      hostSel.graph = {
        nodes:
          hostSel.nodes.length > 0
            ? [...hostSel.nodes].map(initializeNode)
            : [],
        clusters:
          hostSel.clusters && hostSel.clusters.length > 0
            ? [...hostSel.clusters].map(initializeNode)
            : [],
        edges:
          hostSel.links.length > 0
            ? [...hostSel.links].map((e) => {
              if (!e.id) {
                e.id = id();
              }
              return e;
            })
            : [],
      };
      requestAnimationFrame(() => hostSel.draw());
    };
  }
}
