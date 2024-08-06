"use client"

import { useEffect, useState } from 'react';

export default function Home() {
  const [model, setModel] = useState(null); // Load the model on the client-side
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTensorFlow = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
      script.onload = async () => {
        // tf is now available as a global variable
        try {
          const loadedModel = await tf.loadLayersModel('/coding/cat-or-car/model.json');
          setModel(loadedModel);
        } catch (error) {
          console.error('Error loading model:', error);
        }
      };
      document.head.appendChild(script);
    };
    loadTensorFlow();
    setLoading(false);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !model) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      setImg(img)
      img.src = event.target.result;

      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeBilinear([32, 32]) // Make sure this matches your model's expected input shape
          .expandDims(0);

        const prediction = model.predict(tensor);
        const value = prediction.arraySync()[0];
        
        setResult(value);
      };
    };
    reader.readAsDataURL(file);
  };

  if(loading) return <p>Loading TensorFlow Libraries...</p>;


  return (
        <div>
            <h1>Cat or Car?</h1>
            <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button onSubmit={handleSubmit}>Upload</button>
            </form>
            {result && (
                <div>
                  <p>This is a <b>{result[0] < 0.5 ? 'car' : 'cat'}</b>.</p>
                  <p>Output Value: {Math.round((1 - result[0]) * 10000) / 10000} </p>
                  <p>0 is cat, 1 is car</p>
                  {img && (<img src={img.src} style={{"max-width": "25%"}} alt="Uploaded image" />)}

                </div>
            )}
        </div>
  );
}
