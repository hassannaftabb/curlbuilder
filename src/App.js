import React, { useEffect, useState } from 'react';
import './App.css';
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from 'react-icons/io';
import { AiOutlineCopy } from 'react-icons/ai';
import { toast, Toaster } from 'react-hot-toast';
const App = () => {
  const [request, setRequest] = useState({
    method: 'GET',
    url: '',
    headers: '',
    body: '',
    customHeaders: [],
  });
  const [output, setOutput] = useState('');
  const [jsonHeader, setJsonHeader] = useState(false);
  const [acceptSSC, setAcceptSSC] = useState(false);
  const [Verbose, setVerbose] = useState(false);
  const [alert, setAlert] = useState(true);

  useEffect(() => {
    let curl = `curl -X ${request.method} "${request.url}" `;
    if (request.headers) {
      curl += ` -H "${request.headers}"`;
    }
    if (request.customHeaders.length) {
      request.customHeaders.forEach((header) => {
        curl += ` -H "${header.key}: ${header.value}"`;
      });
    }
    if (jsonHeader) {
      curl += ` -H "Content-Type: application/json"`;
    }
    if (acceptSSC) {
      curl += ` --insecure`;
    }
    if (Verbose) {
      curl += ` -v`;
    }
    if (request.body) {
      curl += ` -d "${request.body}"`;
    }
    setOutput(curl);
    console.count('useEffect');
  }, [request, jsonHeader, acceptSSC, Verbose]);

  const addCustomHeader = () => {
    setRequest({
      ...request,
      customHeaders: [...request.customHeaders, { key: '', value: '' }],
    });
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    // setAlert(false);
    // setTimeout(() => {
    //   setAlert(true);
    // }, 5000);
    toast.success('Text copied to clipboard!');
  };

  const handleChangeCustomHeader = (e, i) => {
    const newCustomHeaders = [...request.customHeaders];
    newCustomHeaders[i][e.target.name] = e.target.value;
    setRequest({
      ...request,
      customHeaders: newCustomHeaders,
    });
  };

  const removeCustomHeader = (i) => {
    const newCustomHeaders = [...request.customHeaders];
    newCustomHeaders.splice(i, 1);
    setRequest({
      ...request,
      customHeaders: newCustomHeaders,
    });
  };

  return (
    <div className='text-center my-12'>
      <Toaster />
      <h1 className='text-3xl mb-4 font-mono font-bold my-4 bg-[#2f103f] w-[70vw] text-white rounded-lg p-4 flex items-center justify-center mx-auto'>
        <em>CURL Generator</em>
      </h1>
      <div className='mb-4'>
        <div hidden={alert} className='text-center'>
          <div class='alert alert-success shadow-lg' hidden>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                class='stroke-current flex-shrink-0 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>Text Copied successfully!</span>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-md  inline-flex flex-col shadow-xl'>
          <label className='mb-2 font-semibold'>HTTP Method</label>
          <select
            className='border rounded-md py-2 px-12 border-gray-500'
            value={request.method}
            onChange={(e) => setRequest({ ...request, method: e.target.value })}
          >
            <option value='GET'>GET</option>
            <option value='POST'>POST</option>
            <option value='PUT'>PUT</option>
            <option value='DELETE'>DELETE</option>
          </select>
        </div>
      </div>
      <div>
        <div className='mb-4 bg-white p-4 rounded-md  inline-flex flex-col shadow-xl'>
          <label className='font-semibold mb-2'>URL</label>
          <input
            className='border rounded-lg py-2 px-2 w-64 border-gray-500'
            type='url'
            value={request.url}
            onChange={(e) => setRequest({ ...request, url: e.target.value })}
          />
        </div>
      </div>
      <div>
        <div className='mb-4 bg-white p-4 rounded-md  inline-flex flex-col shadow-xl'>
          <label className='font-semibold mb-2'>Body</label>
          <textarea
            className='border rounded-lg h-60 px-2 py-2 w-72 font-mono border-gray-500'
            value={request.body}
            onChange={(e) => setRequest({ ...request, body: e.target.value })}
          />
        </div>
      </div>
      <div className='mb-4 bg-white p-4 rounded-md  inline-flex flex-col shadow-xl'>
        <label className='block font-semibold mb-2'>Custom Headers</label>
        {request.customHeaders.map((header, i) => (
          <div key={i} className='mb-2'>
            <div className='block text-center'>
              <input
                className='border rounded-lg py-2 px-3 flex-1 mr-2 bg-[#faf7f5] '
                type='text'
                placeholder='Header key'
                name='key'
                value={header.key}
                onChange={(e) => handleChangeCustomHeader(e, i)}
              />
              <input
                className='border rounded-lg py-2 px-3 flex-1 mr-2 bg-[#faf7f5] '
                type='text'
                placeholder='Header value'
                name='value'
                value={header.value}
                onChange={(e) => handleChangeCustomHeader(e, i)}
              />
              <button
                className='bg-white hover:shadow-xl h-6 w-6 rounded-full inline-flex items-center justify-center'
                onClick={() => removeCustomHeader(i)}
              >
                <IoIosRemoveCircleOutline className='text-black' />
              </button>
            </div>
          </div>
        ))}
        <div
          onClick={addCustomHeader}
          className='flex items-center justify-center text-center'
        >
          <button className='text-sm flex items-center justify-center text-center bg-[#faf7f5] rounded-md w-56 hover:shadow-xl h-8'>
            {' '}
            <IoIosAddCircleOutline className='text-xl mr-2' />
            <span> Add Custom Header</span>
          </button>
        </div>
      </div>
      <div className='space-x-2'>
        <label className=' cursor-pointer bg-white p-4 rounded-md  inline-flex flex-col shadow-xl items-center'>
          <div className='font-semibold'>
            <span>JSON Content-Type</span>
            <span
              className={`font-bold ml-2 ${
                jsonHeader ? 'text-green-700' : 'text-orange-600'
              }`}
            >
              ({jsonHeader ? 'yes' : 'no'})
            </span>
          </div>
          <input
            type='checkbox'
            className='checkbox'
            onChange={(e) => {
              setJsonHeader(!jsonHeader);
            }}
          />
        </label>
      </div>
      <div className='space-x-2'>
        <label className='cursor-pointer bg-white p-4 rounded-md  inline-flex flex-col shadow-xl items-center mt-4'>
          <span className='font-semibold'>Accept self-signed certs</span>
          <input
            type='checkbox'
            className='checkbox'
            onChange={(e) => {
              setAcceptSSC(!acceptSSC);
            }}
          />
        </label>
      </div>
      <div className='space-x-2'>
        <label className='cursor-pointer bg-white p-4 rounded-md  inline-flex flex-col shadow-xl items-center mt-4'>
          <span className='font-semibold'>Verbose</span>
          <input
            type='checkbox'
            className='checkbox'
            onChange={(e) => {
              setVerbose(!Verbose);
            }}
          />
        </label>
      </div>
      <div className='output cursor-pointer bg-white p-4 rounded-md  inline-flex flex-col shadow-xl items-center mt-4'>
        <textarea
          defaultValue={output}
          disabled
          readOnly
          className='px-2 h-40 w-56 font-semibold font-mono'
        ></textarea>
      </div>
      <div hidden={request.url !== '' ? false : true} className='my-2'>
        <button className='btn' onClick={() => copyToClipboard(output)}>
          <AiOutlineCopy /> Copy to clipboard
        </button>
      </div>
    </div>
  );
};
export default App;
