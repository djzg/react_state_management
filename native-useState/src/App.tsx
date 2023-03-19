import { useState, useReducer, useMemo, useCallback, useEffect, useRef } from 'react'



////////////////////////////////////
//
// useState
// adds variable state to function components
////////////////////////////////////

function NameList() {
  const [list, setList] = useState(['One', 'Two', 'Three']);
  const [name, setName] = useState(() => "Jack");


  // adding names by getting a list with the new value and later resetting text to empty
  const onAddName = () => {
    setList([...list, name]);
    setName("");
  }

  return (
    <div>
      <ul>
        {list.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      <button onClick={onAddName}>Add name</button>
    </div>
  )
}

// adds 1 after pressing a button, starts counting from 10.
function Counter() {
  const [count, setCount] = useState(10);

  function addOne() {
    setCount(count + 1);
  }

  return (
    <div className="App">
      <button onClick={addOne}>Count = {count}</button>
       
    </div>
  )
}


////////////////////////////////////
// useReducer
// similar to JS reduce function
////////////////////////////////////

// takes the text from input field and writes it to the div
function Reducer() {
  const [ state, dispatch ] = useReducer((state:any, action) => {
    switch (action.type) {
      case "SET_NAME":
        return { ...state, name: action.payload };
      case "ADD_NAME":
        return { 
          ...state, 
          names: [...state.names, state.name], 
          name:"", 
        };
      };
  }, {
    names: [],
    name: "",
  });

  return (
    <div>
      <input 
        type="text" 
        value={state.name} 
        onChange={e => 
          dispatch({type: "SET_NAME", payload: e.target.value})} />
      <div>Name = {state.name}</div>
      <button onClick={() => dispatch({ type: "ADD_NAME" })}>Add Name</button>
      <div>
        {state.names.map((name:any, index:any) => (
          <div key={index}>{name}</div>
        ))}
      </div>
    </div>
    
  )
}

// form takes values from input fields and dispatches changes to the first or last
function UserForm() {
  const [state, dispatch] = useReducer((state, action) => {
    return {
      ...state,
      ...action,
    };
  }, {
    first:"",
    last: "",
  })
  return (
    <div>
      <input 
        type="text" 
        value={state.first} 
        onChange={(e) => dispatch({ first: e.target.value})}/>  
      <input 
        type="text" 
        value={state.last}
        onChange={(e) => dispatch({ last: e.target.value})}/>  

      <div>
        First: {state.first}
      </div>
      <div>
        Last: {state.last}
      </div>
    </div>
  )
}


////////////////////////////////////
// useMemo and useCallback
// useMemo will only recompute the memoized value when one of the deps has changed.
////////////////////////////////////






// takes values and updates only when those values are updated.
function UsingMemo() {
  const [numbers] = useState([15, 20, 50]);

  const total = useMemo(() =>numbers.reduce((acc, number) => acc + number, 0), [numbers]);

  const [random_names] = useState(['Tom', 'Ben', 'Zebra', 'Elvis']);
  const sortedNames = useMemo(() => [...random_names.sort()], [random_names]);

  // this is not a good use of usememo because it's a simple calculation 
  const [count1, setCount1]  = useState(0);
  const [count2, setCount2]  = useState(0);
  const countTotal = useMemo(() => count1 + count2, [count1, count2]);
  // instead use
  const countTotal2 = count1 + count2;
  console.log(countTotal2);

  return (
    <div>
      <div>Total: {total}</div>
      <div>Names: {random_names.join(', ')}</div>
      <div>sortedNames: {sortedNames.join(', ')}</div>
      <button onClick={() => setCount1(count1 + 1)}>Count 1: {count1}</button>
      <button onClick={() => setCount2(count2 + 1)}>Count 2: {count2}</button>
      <div>Count Total: {countTotal}</div>
    </div>
  )
}


// use the useCallback if the callback is going to the nested component as a property
function UsingUseCallback({ list, sortFunc }) { 
  console.log("UsingCallback render");
  
  const sortedList = useMemo(() => {
    console.log("Running sort");
    return [...list].sort(sortFunc);
  }, [list, sortFunc]);

  return (
    <div>sortedList: {sortedList.join(', ')}
    </div>
  )
}



////////////////////////////////////
// useEffect
// 
////////////////////////////////////

// using API requests from JSON files
function UsingUseEffect() {
  const [names, setNames] = useState([]);

  // once the button is pressed, it fetches that name from file
  useEffect(() => {
    fetch("/names.json")
      .then(response => response.json())
      .then(data => setNames(data));
  }, []);

  
  const [selectedName, setSelectedName] = useState(null);
  const [selectedNameDetails, setSelectedNameDetails] = useState(null);

  // triggers the useEffect when selectedName changes and then it fetches data from files
  useEffect(() => {
    if (selectedName) {
      fetch(`/${selectedName}.json`)
        .then((response) => response.json())
        .then((data) => setSelectedNameDetails(data));
    }
  }, [selectedName]);

  // actually, the above useEffect isn't necessary in this case, it can be done like this as well:
  const onSelectedNameChange = (names2:any) => {
    fetch(`/${names2}.json`)
    .then((response) => response.json())
    .then((data) => setSelectedName2(data));
  }


  return (
      <div>
        
        <div>
          {names.map((name) => (
          <button onClick={() => setSelectedName(name)}>{name}</button>
          ))}
        </div>
        <div>{selectedName}</div>
        <div>{JSON.stringify(selectedNameDetails)}</div>
      </div>
    )
}

// counting seconds with useEffect and setInterval
const Stopwatch = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        return t + 1;
      });
    }, 1000);
    // clearing the interval
    return () => clearInterval(interval);
  }, []);


  return (
    
    <div>
      <label>Stopwatch with useEffect and setInterval:</label>
      <br/>
      Time: {time}
    </div>
  )
}



////////////////////////////////////
// useRef
// -when you change the value of a reference it doesn't cause a component to re-render
// -accessing elements in react with useRef
////////////////////////////////////


const UsingUseRef = () => {

  const inputRef2 = useRef(null);

  useEffect(() => {
    // focusing on the current input reference
    inputRef2.current.focus();
  }, []);

  // using inputRef to assign reference to it in array
  const [names, setNames] = useState([]);
  const onAddName = () => {
    setNames([...names, inputRef2.current.value]);
    inputRef2.current.value = "";

  }


  // using useRef to reference incremental id and assign it to the added name
  const idRef = useRef(1);
  const inputRef3 = useRef(null);

  console.log('idref current at start', idRef.current);
  

  const [names2, setNames2] = useState([
    { id2: idRef.current++, name2:"John" },
    { id2: idRef.current++, name2:"Mary" },
  ]);
  const onAddName2 = () => {
    console.log('idRef current', idRef.current);
    console.log('idref next value', idRef.current++);
    console.log('idref before value', idRef.current--);
    setNames2([...names2,
      {
        id2: idRef.current++,
        name2: inputRef3.current.value,
      },
    ]);
 
    inputRef3.current.value = "";
    
  }


////////////////////////////////////
// Context and Custom Hooks
// 
//
////////////////////////////////////


  return (
    <div>
      <label>useRef examples:</label>
      <input type="text" ref={inputRef2}/>


      <div>
        {names.map((name) => (
          <div key={name}>{name}</div>
        ))}
      </div>
      <input type="text" ref={inputRef2}></input>
      <button onClick={onAddName}>Add Name</button>


      <div>
        {names2.map((name2) => (
          <div id2={name2.id2}>{name2.id2} - {name2.name2}</div>
        ))}
      </div>
      <input type="text" ref={inputRef3}></input>
      <button onClick={onAddName2}>Add Name</button>
    </div>
  );
}






// main app render
function App() {
  const [random_names] = useState(['Tom', 'Ben', 'Zebra', 'Elvis']);
  const sortFunc = useCallback((a:any, b:any) => a.localeCompare(b) * -1, []);



  return (
    <div>
      <Counter />
      <NameList />
      <br />
      <Reducer />
      <br />
      <UserForm />
      <br />
      <UsingMemo />
      <br />
      <UsingUseCallback list={random_names} sortFunc={sortFunc}/>
      <br />
      <UsingUseEffect />
      <br />
      <Stopwatch />
      <UsingUseRef />

    </div>
  )
}

export default App
