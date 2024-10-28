import  { useState, useEffect, useRef } from "react";
import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import { IoIosSearch, IoIosClose } from "react-icons/io";

function MyCustomComponent() {
  const { mapData, mapView } = useMap();
  const [input, setInput] = useState('');
  const [autofill, setAutofill] = useState<JSX.Element[]>([])
  mapView.expand()
  mapView.Outdoor.setStyle('https://tiles-cdn.mappedin.com/styles/starlight/style.json');
  const firstSpace = mapData.getByType('space').find(s => s.name === '200');
  const secondSpace = mapData.getByType('space').find(s => s.name === 'Male washroom');
  if (firstSpace && secondSpace) {
    const directions = mapView.getDirections(firstSpace, secondSpace);
    if (directions) {
      mapView.Navigation.draw(directions);
    }
  }
  var spaceList: string[] = []
  mapData.getByType("space").forEach((space) => {
    if (space.name){
      spaceList.push(space.name.trim())
    }
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#1374c5",
    });
  });
  mapData.getByType("connection").forEach((connection) => {
    const coords = connection.coordinates.find(
      (coord) => coord.floorId === mapView.currentFloor.id
    );
    if (coords) {
      mapView.Labels.add(coords, connection.name);
    }
  });
  var fullList:string[] = spaceList
  spaceList = [...new Set(spaceList)]
  spaceList.sort()

  const [menuDisplay, setMenuDisplay] = useState('none')
  const [content, setContent] = useState(['https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'])

  const runMenu = (nameStr:string) => {
    let itemCount:number = 0
    for (let i = 0; i<fullList.length; i++){
      if (fullList[i]==nameStr){
        itemCount+=1
      }
    }
    if (itemCount==1){
      setMenuDisplay('flex')
      setAutofill([])
      let images: string = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
      let desc: string
      mapData.getByType("space").forEach((space) => {
        if (space.name==nameStr){
          if (space.images.length>0){
            images = space.images[0]
            desc = space.description
          }
        }
      });
    } else if (itemCount==2){

    } else {
      console.log('error')
    }
  }

  useEffect(()=>{
    var rows: JSX.Element[] = []
    for (let i = 0; i<spaceList.length; i++){
      if ((input!='')&&(spaceList[i].toLowerCase().indexOf(input.toLowerCase())!=-1)){
        rows.push(
          <div key={i} className="hover:bg-[#eee] py-[6px] px-[20px] border-t-[1px] border-t-[#bbb] border-t-solid text-[0.9rem] cursor-pointer bg-white" onClick={()=>{
            runMenu(spaceList[i])
          }}>
            <p className="text-[#222]">{spaceList[i]}</p>
          </div>
        )
      }
    }
    setAutofill(rows)
  }, [input])

  return (
    <>
      {mapData.getByType("space").map((space) => {
        console.log(space.images)
        return (
          <Label key={space.id} target={space.center} text={space.name} />
        )
      })}
      <div style={{ display: menuDisplay }} className="top-0 p-[20px] flex-row items-center justify-center fixed box-border w-[400px] top-0 max-w-screen h-screen">
        <div className="h-full bg-white border-2 border-solid border-[#ddd] rounded-[15px] p-0 flex flex-col items-center justify-start grow overflow-hidden">
          <div className="h-[1rem] m-[12px]"/>
          <div className="flex flex-col p-4 gap-4 items-center justify-start">
            <div className="aspect-video overflow-none flex items-center justify-center w-full">
              <img className="min-w-full min-h-full" src={''}></img>
            </div>
          </div>
        </div>
      </div>
      <div className="top-0 p-[20px] flex flex-row items-center justify-center fixed box-border w-[400px] top-0 max-w-screen">
        <div className="focus-within:border-[#4ad] bg-white border-2 border-solid border-[#ddd] rounded-[15px] p-0 flex flex-col items-center justify-center grow overflow-hidden">
          <div className="bg-white flex flex-row items-center justify-center grow gap-[10px] w-full py-[10px] px-[20px] box-border">
            <IoIosSearch/>
            <input placeholder="Search WCI Maps" className="h-full text-[1rem] b-0 grow focus:outline-none" value={input} onChange={(e)=>{setInput(e.target.value)}}/>
            <div className="bg-white rounded-full hover:brightness-90 overflow-none cursor-pointer p-2" onClick={()=>{
              setAutofill([])
              setInput('')
            }}>
              <IoIosClose/>
            </div>
          </div>
          <div className="flex w-full flex-col">
            {autofill}
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  // See Demo API key Terms and Conditions
  // https://developer.mappedin.com/v6/demo-keys-and-maps/
  const { isLoading, error, mapData } = useMapData({
    mapId: '66f7ff6142d0ac000b79d8db',
    key: import.meta.env.VITE_MY_VERCEL_MY_KEY,
    secret: import.meta.env.VITE_MY_VERCEL_MY_SECRET,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  return mapData ? (
    <MapView mapData={mapData}>
      <MyCustomComponent />
    </MapView>
  ) : null;
}
