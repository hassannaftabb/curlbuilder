import React, { useEffect, useState } from 'react';
import './App.css';
import '../node_modules/codemirror/lib/codemirror.css';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { AiOutlineCopy } from 'react-icons/ai';
import { toast, Toaster } from 'react-hot-toast';
import CodeMirror from 'react-codemirror';
require('codemirror/mode/javascript/javascript');
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
  var options = {
    lineNumbers: true,
    mode: 'javascript',
  };
  return (
    <div className='text-center my-12 overflow-x-hidden'>
      <Toaster />
      <h1 className='text-3xl mb-4 font-mono font-bold my-4 bg-[#2f103f] w-[70vw] text-white shaodw-lg border-2 border-white p-4 flex items-center justify-center mx-auto'>
        <em>-cURL --generator</em>
      </h1>
      <section className='w-screen grid sm:grid-cols-2 grid-cols-1'>
        <div className='mb-4 bg-white p-4 rounded-md  inline-flex flex-col shadow-xl text-start'>
          <label className='font-semibold mb-2 text-center'>Body</label>
          <CodeMirror
            value={request.body}
            onChange={(e) => setRequest({ ...request, body: e })}
            options={options}
            className='h-full'
          />
        </div>
        <div>
          <div className='bg-white p-4 rounded-md  inline-flex flex-col shadow-xl my-2'>
            <label className='mb-2 font-semibold'>HTTP Method</label>
            <select
              className='select select-bordered w-80 select-accent border-2 border-[#2f103f]'
              value={request.method}
              onChange={(e) =>
                setRequest({ ...request, method: e.target.value })
              }
            >
              <option value='GET'>GET</option>
              <option value='POST'>POST</option>
              <option value='PUT'>PUT</option>
              <option value='DELETE'>DELETE</option>
            </select>
          </div>
          <div>
            <div className='mb-4 bg-white p-4 rounded-md  inline-flex flex-col shadow-xl'>
              <label className='font-semibold mb-2'>URL</label>

              <input
                type='url'
                placeholder='Type here'
                className='input w-80 border-2 border-[#2f103f]'
                value={request.url}
                onChange={(e) =>
                  setRequest({ ...request, url: e.target.value })
                }
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
                    className='btn btn-circle'
                    onClick={() => removeCustomHeader(i)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div
              onClick={addCustomHeader}
              className='flex items-center justify-center text-center'
            >
              <button className='text-sm flex items-center justify-center text-center bg-[#faf7f5] rounded-md w-56 hover:shadow-xl h-8 border-2 border-[#2f103f]'>
                {' '}
                <IoIosAddCircleOutline className='text-xl mr-2' />
                <span>Add Custom Header</span>
              </button>
            </div>
          </div>
          <div className='space-x-2'>
            <label className=' cursor-pointer bg-white p-4 rounded-md  inline-flex flex-col shadow-xl items-center'>
              <div className='font-semibold'>JSON Content-Type</div>
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
      </section>
    </div>
  );
};
export default App;
