import { SimulationNodeDatum } from "d3";

export class D3Node implements d3.SimulationNodeDatum {
    index?: number;
    x?: any;
    y?: any;
    fixed?: boolean;
    label?: string;
}

export class D3Link implements d3.SimulationLinkDatum<D3Node> {
    constructor(source: D3Node, target: D3Node) {
        this.source = source;
        this.target = target;
    }

    index?: number;

    source: D3Node;
    target: D3Node;
}