interface Vector3 {
    x: number;
    y: number;
    z: number;
}

class pdbFileData {

}

// Mock GameObject for demonstration purposes
export class GameObject {
    public transform: {
        position: Vector3,
        scale: Vector3,
        parent?: GameObject
    };
    public children: GameObject[] = [];

    constructor(public name: string) {
        this.transform = {
            position: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        };
    }

    static CreatePrimitive(): GameObject {
        return new GameObject('Sphere');
    }

    addChild(child: GameObject): void {
        child.transform.parent = this;
        this.children.push(child);
    }
}

const residueObjects: { [key: number]: GameObject } = {};
const newProtein = new GameObject("Protein");

export const mungePDBdata = (pdbData: string): GameObject => {
    const lines = pdbData.split("\n");
    for (const line of lines) {
        console.log(line);
        if (line.startsWith("ATOM")) {
            const residueSeqNum = parseInt(line.substring(22, 26).trim());

            // Parsing atom data
            // ... (similar to your C# code)
            const atomName = line.substring(12, 16).trim();
            const residueName = line.substring(17, 20).trim();
            const position: Vector3 = {
                x: parseFloat(line.substring(30, 38).trim()),
                y: parseFloat(line.substring(38, 46).trim()),
                z: parseFloat(line.substring(46, 54).trim()),
            };

            // Check if the residue sequence number already exists
            if (!residueObjects[residueSeqNum]) {
                const newResidue = new GameObject("Residue_" + residueSeqNum);
                newResidue.transform.parent = newProtein; // Set the parent object
                newProtein.addChild(newResidue); // Add new residue as a child of newProtein
                residueObjects[residueSeqNum] = newResidue;
            }

            // Create a new atom (sphere) for the current residue sequence number
            const atom = GameObject.CreatePrimitive();
            atom.transform.position = position;
            atom.transform.scale = { x: 0.2, y: 0.2, z: 0.2 };
            atom.transform.parent = residueObjects[residueSeqNum];
            residueObjects[residueSeqNum].addChild(atom); // Add atom as a child of the residue
        }

    }
    return newProtein;
}
