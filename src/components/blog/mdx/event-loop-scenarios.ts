// Authored, precomputed frames for <EventLoopStepper />. Nothing here is executed: each frame is written by hand and
// checked by event-loop-scenarios.test.ts. Every description is in both languages.
export type Localized = Readonly<{ en: string; de: string }>

export type Frame = Readonly<{
  /** The 1-based line of the code being run, or null between steps. */
  line: number | null
  stack: readonly string[]
  micro: readonly string[]
  tasks: readonly string[]
  log: readonly string[]
  note: Localized
}>

export type Scenario = Readonly<{ code: string; frames: readonly Frame[] }>

const ORDER_CODE = `console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')`

const AWAIT_CODE = `async function load() {
  console.log('A')
  await null
  console.log('B')
}
console.log('C')
load()
console.log('D')`

export const SCENARIOS = {
  order: {
    code: ORDER_CODE,
    frames: [
      {
        line: null,
        stack: [],
        micro: [],
        tasks: [],
        log: [],
        note: {
          en: 'Nothing has run yet. JavaScript starts at the first line and runs one thing at a time.',
          de: 'Noch ist nichts gelaufen. JavaScript beginnt in der ersten Zeile und führt immer nur eine Sache aus.'
        }
      },
      {
        line: 1,
        stack: ["console.log('1')"],
        micro: [],
        tasks: [],
        log: ['1'],
        note: {
          en: 'The first line is a plain call. It runs at once and logs 1.',
          de: 'Die erste Zeile ist ein normaler Aufruf. Er läuft sofort und loggt 1.'
        }
      },
      {
        line: 2,
        stack: ['setTimeout(…)'],
        micro: [],
        tasks: ['timeout callback (logs 2)'],
        log: ['1'],
        note: {
          en: 'setTimeout hands the callback to the browser. Even with 0 ms it does not run now, it runs later as a task. We show it waiting in the task queue.',
          de: 'setTimeout übergibt den Callback an den Browser. Auch mit 0 ms läuft er nicht jetzt, sondern später als Task. Hier wartet er in der Task-Queue.'
        }
      },
      {
        line: 3,
        stack: ['Promise.resolve().then(…)'],
        micro: ['then callback (logs 3)'],
        tasks: ['timeout callback (logs 2)'],
        log: ['1'],
        note: {
          en: 'The promise is already resolved, so the .then callback goes into the microtask queue right away.',
          de: 'Das Promise ist schon erfüllt, also landet der .then-Callback sofort in der Microtask-Queue.'
        }
      },
      {
        line: 4,
        stack: ["console.log('4')"],
        micro: ['then callback (logs 3)'],
        tasks: ['timeout callback (logs 2)'],
        log: ['1', '4'],
        note: {
          en: 'Another plain call. It logs 4. A running function is never interrupted to run the callbacks.',
          de: 'Noch ein normaler Aufruf. Er loggt 4. Eine laufende Funktion wird nie unterbrochen, um die Callbacks auszuführen.'
        }
      },
      {
        line: null,
        stack: [],
        micro: ['then callback (logs 3)'],
        tasks: ['timeout callback (logs 2)'],
        log: ['1', '4'],
        note: {
          en: 'The code is finished and the call stack is empty. Now the browser looks at the queues. Microtasks come first.',
          de: 'Der Code ist durch und der Call Stack ist leer. Jetzt schaut der Browser in die Queues. Microtasks kommen zuerst.'
        }
      },
      {
        line: 3,
        stack: ['then callback'],
        micro: [],
        tasks: ['timeout callback (logs 2)'],
        log: ['1', '4', '3'],
        note: {
          en: 'The microtask runs and logs 3.',
          de: 'Der Microtask läuft und loggt 3.'
        }
      },
      {
        line: null,
        stack: [],
        micro: [],
        tasks: ['timeout callback (logs 2)'],
        log: ['1', '4', '3'],
        note: {
          en: 'The microtask queue is empty. Only now can the browser take the next task.',
          de: 'Die Microtask-Queue ist leer. Erst jetzt nimmt der Browser den nächsten Task.'
        }
      },
      {
        line: 2,
        stack: ['timeout callback'],
        micro: [],
        tasks: [],
        log: ['1', '4', '3', '2'],
        note: {
          en: 'The task runs and logs 2. The order is 1, 4, 3, 2.',
          de: 'Der Task läuft und loggt 2. Die Reihenfolge ist 1, 4, 3, 2.'
        }
      }
    ]
  },
  'async-await': {
    code: AWAIT_CODE,
    frames: [
      {
        line: null,
        stack: [],
        micro: [],
        tasks: [],
        log: [],
        note: {
          en: 'Nothing has run yet. Declaring the function logs nothing, so the first call is on line 6.',
          de: 'Noch ist nichts gelaufen. Die Funktionsdeklaration loggt nichts, der erste Aufruf steht in Zeile 6.'
        }
      },
      {
        line: 6,
        stack: ["console.log('C')"],
        micro: [],
        tasks: [],
        log: ['C'],
        note: {
          en: 'A plain call. It logs C.',
          de: 'Ein normaler Aufruf. Er loggt C.'
        }
      },
      {
        line: 7,
        stack: ['load()'],
        micro: [],
        tasks: [],
        log: ['C'],
        note: {
          en: 'load() is called. It goes onto the call stack and starts running.',
          de: 'load() wird aufgerufen. Die Funktion landet auf dem Call Stack und läuft los.'
        }
      },
      {
        line: 2,
        stack: ['load()', "console.log('A')"],
        micro: [],
        tasks: [],
        log: ['C', 'A'],
        note: {
          en: 'An async function runs synchronously up to its first await. So A is logged now.',
          de: 'Eine async-Funktion läuft bis zum ersten await synchron. Also wird A jetzt geloggt.'
        }
      },
      {
        line: 3,
        stack: ['load()'],
        micro: ['rest of load() (logs B)'],
        tasks: [],
        log: ['C', 'A'],
        note: {
          en: 'await null pauses load(). The rest of the function is scheduled as a microtask.',
          de: 'await null pausiert load(). Der Rest der Funktion wird als Microtask eingeplant.'
        }
      },
      {
        line: 7,
        stack: [],
        micro: ['rest of load() (logs B)'],
        tasks: [],
        log: ['C', 'A'],
        note: {
          en: 'load() returns a promise to its caller and leaves the call stack. The script goes on.',
          de: 'load() gibt dem Aufrufer ein Promise zurück und verlässt den Call Stack. Das Skript läuft weiter.'
        }
      },
      {
        line: 8,
        stack: ["console.log('D')"],
        micro: ['rest of load() (logs B)'],
        tasks: [],
        log: ['C', 'A', 'D'],
        note: {
          en: 'D is logged. The paused code of load() is still waiting.',
          de: 'D wird geloggt. Der pausierte Rest von load() wartet noch.'
        }
      },
      {
        line: null,
        stack: [],
        micro: ['rest of load() (logs B)'],
        tasks: [],
        log: ['C', 'A', 'D'],
        note: {
          en: 'The script is finished and the call stack is empty. Now the microtasks run.',
          de: 'Das Skript ist durch und der Call Stack ist leer. Jetzt laufen die Microtasks.'
        }
      },
      {
        line: 4,
        stack: ['load()', "console.log('B')"],
        micro: [],
        tasks: [],
        log: ['C', 'A', 'D', 'B'],
        note: {
          en: 'The rest of load() continues as a microtask and logs B. The order is C, A, D, B.',
          de: 'Der Rest von load() läuft als Microtask weiter und loggt B. Die Reihenfolge ist C, A, D, B.'
        }
      }
    ]
  }
} as const satisfies Record<string, Scenario>

export type ScenarioId = keyof typeof SCENARIOS
