


export async function LatexWrapper({content}) {
    return (
        <div>
        <img width="500px" src={`https://math.vercel.app?color=white&inline=${content}`} alt={content} />
        </div>
    );
}