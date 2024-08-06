

export async function LatexWrapper({content, ...props}) {

    const baseWidth = 50;
    const complexityFactor = 10;

    let estimatedContent = content.replaceAll('/\[[^\]]+\]|\{[^}]+\}|<[^>]+>/', '') //remove all brackets
    estimatedContent = estimatedContent.replaceAll('\\', '') //remove all latex commands
    const estimated = baseWidth + complexityFactor * estimatedContent.length;

    content = content.replaceAll('+', '%2B');



    return (
            <>
            <br />
            <div className="flex justify-center" style={{textAlign: 'center', overflow: 'hidden', width: '100%'}}>
                <img width={props.width ? props.width :`${estimated}px`} src={`https://math.vercel.app?color=white&inline=${content}`} alt={"latex: " + content} />
            </div>
            <br />
            </>

    );
}