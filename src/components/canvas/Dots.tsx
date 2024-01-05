import { useRef } from 'react'
import Dot from './Dot'
import { useThemeStore } from '@/zustand/themeStore'
import Atom from './Atom';

export default function Dots({ ...props }) {

  const mesh = useRef(null)

  const multiplier = useThemeStore((state) => state.multiplier);

  const mapArray = new Array(multiplier).fill('');

  const [PDBdata, setPDBdata] = useThemeStore(
    (state) => [state.PDBdata, state.setPDBdata]
  )

  return (
    <group ref={mesh} {...props} rotation={[0.09999, 0, 0]} position={[0, 1, -2]}>
      {PDBdata ? PDBdata.children.map((eachResidue, i) => {
        return eachResidue.children.map((eachAtom, j) => {
          return <Atom atomData={eachAtom} residue={i} key={`${i}-${j}`} />
        })
      }) : mapArray.map((each, i) => {
        return <Dot ndex={i} key={i} />
      })}
    </group>
  )
}
