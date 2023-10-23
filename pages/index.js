// pages/upload.js
import { useState } from 'react';
import Dropzone from '../components/Dropzone';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [captions, setCaptions] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length + files.length > 5) {
      setError('You can only upload up to 5 images.');
      return;
    }
    setError(null);  // clear any previous error
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  };

  const handleUpload = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare form data
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('captions', captions);

      // Send a POST request to the /upload endpoint
      const response = await fetch('https://mdmagic.fly.dev/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResponse(data?.markdownData);
      console.log(data.markdownData);
    } catch {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // Log the response data (markdown links)
  };

  return (

    <main className='container mx-auto my-12'>
      <h1 className="mb-4 text-4xl font-mono font-extrabold leading-none text-left tracking-tight text-gray-900 md:text-5xl lg:text-4xl">mdMagic</h1>
      <p className="mb-6 text-lg font-normal text-gray-500 text-left lg:text-xl ">
        Transform Your Images into Markdown Instantly.
      </p>
      <p className="mb-3 text-gray-500 ">
        Are you a blogger, developer, or anyone in need of converting images into markdown syntax?
      </p>

      <div>

        <h2 className="mb-2 text-lg font-semibold text-gray-900">How it works:</h2>
        <ul className="max-w-full space-y-1 text-gray-500 list-disc list-inside">
          <li>
            Upload: Drag and drop or click to upload your images and add captions.
          </li>
          <li>
            Convert: Hit the Upload button! Your images are now in markdown syntax.
          </li>
          <li>
            Copy: Just copy the markdown and use it wherever you need.
          </li>
        </ul>

      </div>
      <div className="upload-form p-4">
        <Dropzone onDrop={handleDrop} files={files} />
        <input
          type="text"
          placeholder="Enter captions, separated by commas"
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5"
        />
        <button type="button" onClick={handleUpload} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Upload</button>

        {loading && (
          <div className="mt-4">
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500">
            <p>Error: {error}</p>
          </div>
        )}

        {response && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Markdown Links:</h2>

            {response.map((markdown, index) => (
              <div key={index} className="">
                <code className="block bg-gray-800  p-4 text-sm text-white font-mono rounded-sm shadow-lg my-2">
                  {markdown.markdown}
                </code>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
