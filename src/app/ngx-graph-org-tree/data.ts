export interface Station {
  id: string,
  position?: {
    x: number,
    y: number,
  }
  middleware?: boolean,
  connections?: string[]
}

export interface StationEdge {
  source: string,
  target: string,
  direction?: {
    start?: {
      x: number,
      y: number,
    }
    end?: {
      x: number,
      y: number,
    }
  }
}

export const DIR = {
  'L': {x: -1, y: 0},
  'T': {x: 0, y: -1},
  'R': {x: 1, y: 0},
  'B': {x: 0, y: 1},

  'LT': {x: -1, y: -1},
  'LB': {x: -1, y: 1},
  'RT': {x: 1, y: -1},
  'RB': {x: 1, y: 1},
}

export const coords: any = {
  "МСК": {"x": 734.9390878481788, "y": 813.2687480869295},
  "ОКТ": {"x": 737.0609121518207, "y": 250.15293662586868},
  "МСКОКТ": {"x": 737.8816764231581, "y": 510.5382064989346},
  "СЕВ": {"x": 1339.6426297899136, "y": 503.31828950139135},
  "МСКСЕВ": {"x": 1047.9066149650396, "y": 648.603479801313},
  "ГОР": {"x": 1407.6426169603, "y": 811.7194570987175},
  "МСКГОР": {"x": 1052.483718794746, "y": 812.5812649005253},
  "КБШ": {"x": 1339.75361328915, "y": 1166.6393823585304},
  "МСККБШ": {"x": 1038.685385583723, "y": 1006.6968863900223},
  "ЮВС": {"x": 737.097470235056, "y": 1319.2433402767165},
  "МСКЮВС": {"x": 736.6763196667165, "y": 1132.9573743839828},
  "ЮВСУКР": {"x": 152.41579027587258, "y": 1117.7157953563978},
  "МСКЮВСУКР": {"x": 448.7798269234031, "y": 965.3000050805231},
  "БЕЛ": {"x": 77.90140391877935, "y": 816.2712323663401},
  "МСКБЕЛ": {"x": 408.13561618317004, "y": 816.2712323663391}
};
export const stations = [
  {
    id: 'МСК',
  },
  {
    id: 'ОКТ',
  },
  {
    id: 'МСКОКТ',
    connectedWith: ['МСК', 'ОКТ'],
    middleware: true,
    connections: ['Поворово 1', 'Савелово', 'Ховрино', 'Шаховская', 'Осуга'],
  },

  {
    id: 'СЕВ',
  },
  {
    id: 'МСКСЕВ',
    connectedWith: ['МСК', 'СЕВ'],
    middleware: true,
    connections: ['Александрово'],
  },

  {
    id: 'ГОР',
  },
  {
    id: 'МСКГОР',
    connectedWith: ['МСК', 'ГОР'],
    middleware: true,
    connections: ['Петушки', 'Черусти'],
  },

  {
    id: 'КБШ',
  },
  {
    id: 'МСККБШ',
    connectedWith: ['МСК', 'КБШ'],
    middleware: true,
    connections: ['Кустаревка'],
  },

  {
    id: 'ЮВС',
  },
  {
    id: 'МСКЮВС',
    connectedWith: ['МСК', 'ЮВС'],
    middleware: true,
    connections: ['Елец', 'Ефремов', 'Курск', 'Пост 315 км'],
  },

  {
    id: 'ЮВСУКР',
  },
  {
    id: 'МСКЮВСУКР',
    connectedWith: ['МСК', 'ЮВСУКР'],
    middleware: true,
    connections: ['Зерново', 'Красное', 'Теткино'],
  },

  {
    id: 'БЕЛ',
  },
  {
    id: 'МСКБЕЛ',
    connectedWith: ['МСК', 'БЕЛ'],
    middleware: true,
    connections: ['Сураж', 'Красное', 'Заольша'],
  },
];

export const stationEdges: StationEdge[] =
  [
    {
      source: 'МСК',
      target: 'МСКОКТ',
      direction: {
        start: DIR.T,
        end: DIR.B
      }
    },
    {
      source: 'МСКОКТ',
      target: 'ОКТ',
      direction: {
        start: DIR.T,
        end: DIR.B
      }
    },

    {
      source: 'МСК',
      target: 'МСКСЕВ',
      direction: {
        start: DIR.RT,
        end: DIR.B
      }
    },
    {
      source: 'МСКСЕВ',
      target: 'СЕВ',
      direction: {
        start: DIR.RT,
        end: DIR.B
      }
    },

    {
      source: 'МСК',
      target: 'МСКГОР',
      direction: {
        start: DIR.R,
        end: DIR.L
      }
    },
    {
      source: 'МСКГОР',
      target: 'ГОР',
      direction: {
        start: DIR.R,
        end: DIR.L
      }
    },

    {
      source: 'МСК',
      target: 'МСККБШ',
      direction: {
        start: DIR.RB,
        end: DIR.T
      }
    },
    {
      source: 'МСККБШ',
      target: 'КБШ',
      direction: {
        start: DIR.RB,
        end: DIR.T
      }
    },

    {
      source: 'МСК',
      target: 'МСКЮВС',
      direction: {
        start: DIR.B,
        end: DIR.T
      }
    },
    {
      source: 'МСКЮВС',
      target: 'ЮВС',
      direction: {
        start: DIR.B,
        end: DIR.T
      }
    },

    {
      source: 'МСК',
      target: 'МСКЮВСУКР',
      direction: {
        start: DIR.LB,
        end: DIR.T
      }
    },
    {
      source: 'МСКЮВСУКР',
      target: 'ЮВСУКР',
      direction: {
        start: DIR.LB,
        end: DIR.T
      }
    },

    {
      source: 'МСК',
      target: 'МСКБЕЛ',
      direction: {
        start: DIR.L,
        end: DIR.R
      }
    },
    {
      source: 'МСКБЕЛ',
      target: 'БЕЛ',
      direction: {
        start: DIR.L,
        end: DIR.R
      }
    },
  ];
