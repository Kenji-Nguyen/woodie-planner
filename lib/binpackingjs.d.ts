declare module "binpackingjs" {
  export namespace BP2D {
    class Box {
      constructor(name: string, width: number, height: number);
      name: string;
      width: number;
      height: number;
      x: number;
      y: number;
      packed: boolean;
    }

    class Bin {
      constructor(width: number, height: number);
      width: number;
      height: number;
      boxes: Box[];
    }

    class Packer {
      constructor(bins: Bin[]);
      bins: Bin[];
      pack(boxes: Box[]): Box[];
    }

    const heuristics: {
      BestAreaFit: any;
      BestLongSideFit: any;
      BestShortSideFit: any;
      BottomLeft: any;
    };
  }

  export namespace BP3D {
    // 3D bin packing (not used in this project)
  }
}
