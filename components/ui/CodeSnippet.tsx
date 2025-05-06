// components/landing/CodeSnippet.tsx
const CodeSnippet = () => {
    return (
      <div className="bg-slate-800 border-slate-800 p-4 rounded-lg text-white">
        <pre>
          <code>
            {`import time
  start_time = time.time()
  def fun():
      a = 2
      b = 3
      c = a + b
  end_time = time.time() 
  fun()
  timetaken = end_time - start_time 
  print("Your program takes:", timetaken)`}
          </code>
        </pre>
      </div>
    );
  };
  
  export default CodeSnippet;
  