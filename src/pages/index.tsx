import AudioControls from '@/components/dom/AudioControls';
import { useThemeStore } from '@/zustand/themeStore';
import dynamic from 'next/dynamic';


// Dynamic import is used to prevent a payload when the website starts, that includes three.js, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
// const Logo = dynamic(() => import('@/components/canvas/Logo'), { ssr: false })
const Dots = dynamic(() => import('@/components/canvas/Dots'), { ssr: false })

// Dom components go here
export default function Page(props) {


  const [inverseSpeed, setInverseSpeed] = useThemeStore(
    (state) => [state.inverseSpeed, state.setInverseSpeed]
  )

  const [multiplier, setMultiplier] = useThemeStore(
    (state) => [state.multiplier, state.setMultiplier]
  )

  const [playing, setPlaying] = useThemeStore(
    (state) => [state.playing, state.setPlaying]
  )

  const [PDB, setPDB] = useThemeStore(
    (state) => [state.PDB, state.setPDB]
  )

  const [PDBdata, setPDBdata] = useThemeStore(
    (state) => [state.PDBdata, state.setPDBdata]
  )

  const [forward, setForward] = useThemeStore(
    (state) => [state.forward, state.setForward]
  )

  const pauseHandler = () => {
    setPlaying(false);
  }

  const playHandler = () => {
    setPlaying(true);
  }

  const pdbHandler = (e) => {
    setPDB(e.target.value);
  }

  function concatenate(chunks) {
    let length = 0;
    chunks.forEach(item => {
      length += item.length;
    });
    const result = new Uint8Array(length);

    let offset = 0;
    chunks.forEach(item => {
      result.set(item, offset);
      offset += item.length;
    });
    return result;
  }

  const pdbSearchHandler = async () => {
    fetch(`https://files.rcsb.org/view/${PDB}.pdb`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.body;
      })
      .then(rs => {
        const reader = rs.getReader();
        let chunks = [];

        return reader.read().then(function processText({ done, value }) {
          if (done) {
            return new TextDecoder().decode(concatenate(chunks));
          }
          chunks.push(value);
          return reader.read().then(processText);
        });
      })
      .then(text => {
        setPDBdata(text);
      })
      .catch(err => console.error(err));
  }

  const forwardHandler = () => {
    setForward(true);
  }

  const reverseHandler = () => {
    setForward(false);
  }

  const speedUpHandler = () => {
    setInverseSpeed(inverseSpeed === 99 ? 99 : inverseSpeed + 1);
  }

  const speedDownHandler = () => {
    setInverseSpeed(inverseSpeed === 1 ? 1 : inverseSpeed - 1);
  }

  const particleNumberUpHandler = () => {
    setMultiplier((multiplier === 99 ? 99 : multiplier + 1));
  }

  const particleNumberDownHandler = () => {
    setMultiplier((multiplier === 1 ? 1 : multiplier - 1));
  }


  return (
    <>
      <header className='flex flex-wrap  items-center justify-around gap-1 bg-purple-800 p-1'>
        <div>
          <a href="https://github.com/forestheims/provision" target='_blank' rel="opener author">
            <h1 className='cursor-pointer text-lg font-bold text-lime-400'>ProVision</h1>
            <h2>A <strong>Pro</strong>tein <strong>Vis</strong>ualizat<strong>ion</strong > Tool</h2>
          </a>
        </div>
        <div className='flex gap-1'>
          <input onChange={(e) => pdbHandler(e)} className='rounded bg-purple-400 p-1 pl-3 hover:bg-purple-300 text-black placeholder-black' placeholder='PDB identifier' name="PDB" id="PDB" />
          <button className='rounded bg-lime-700 pl-2 pr-2 ml-2 hover:bg-lime-600' onClick={() => pdbSearchHandler()}>Search</button>
        </div>
        <div className='flex gap-1'>
          {/* <h2>
            {playing ? <button className='w-12 rounded bg-rose-500 p-1' onClick={() => pauseHandler()}>Pause</button> : <button className='w-12 rounded bg-lime-500 p-1' onClick={() => playHandler()}>Play{' '}</button>}
          </h2>
          <h2>
            {forward ? <button className='w-16 rounded bg-lime-500 p-1' onClick={() => reverseHandler()}>Reverse</button> : <button className='w-16 rounded bg-rose-500 p-1' onClick={() => forwardHandler()}>Forward</button>}
          </h2> */}
        </div>
        <div className='flex items-center gap-2'>
          {/* <h2>
            Particles: {multiplier}
          </h2>
          <div className='flex flex-col'>
            <button onMouseDown={() => particleNumberUpHandler()} className='flex justify-center rounded-xl font-bold text-lime-500 hover:bg-purple-600'>Up</button>
            <button onMouseDown={() => particleNumberDownHandler()} className='flex justify-center rounded-xl font-bold text-lime-500 hover:bg-purple-600'>Down</button>
          </div> */}
        </div>
        <div className='flex items-center gap-2'>
          {/* <h2>Inverse Speed: {inverseSpeed}</h2>
          <div className='flex flex-col'>
            <button onMouseDown={() => speedUpHandler()} className='flex justify-center rounded-xl font-bold text-lime-500 hover:bg-purple-600'>Up</button>
            <button onMouseDown={() => speedDownHandler()} className='flex justify-center rounded-xl font-bold text-lime-500 hover:bg-purple-600'>Down</button>
          </div> */}
        </div>
      </header>
      <footer className='fixed bottom-0 flex w-full items-center justify-center bg-purple-800 h-2'>

      </footer>
    </>
  )
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = (props) => <Dots />

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
