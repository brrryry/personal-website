export async function BlogImage({ caption, src, ...props }) {
  return (
    <>
      <br />
      <figure className="items-center text-center">
        <div className="flex justify-center">
          <img
            src={src}
            style={props.style ? props.style : {}}
            width={props.width ? props.width : "auto"}
            alt={props.alt ? props.alt : "Image with no alt :("}
          ></img>
        </div>
        <p>
          {caption}{" "}
          {props.source && (
            <>
              {" "}
              {"("}
              <a href={props.source} target="_blank">
                source
              </a>
              {")"}
            </>
          )}
        </p>
      </figure>

      <br />
    </>
  );
}
