declare module "binpackingjs" {
  export class Box {
    constructor(name: string, width: number, height: number, depth?: number);
    name: string;
    width: number;
    height: number;
    depth?: number;
  }

  export class Bin {
    constructor(width: number, height: number, depth?: number);
    width: number;
    height: number;
    depth?: number;
    items?: Array<{
      x: number;
      y: number;
      z?: number;
      item: Box;
    }>;
  }

  export interface PackerOptions {
    allowRotation?: boolean;
  }

  export class Packer {
    constructor(bins: Bin[]);
    bins: Bin[];
    pack(boxes: Box[], options?: PackerOptions): void;
  }
}
