import  { useState, useEffect } from "react";
import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import { IoIosSearch } from "react-icons/io";

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
  // var fullList = spaceList
  spaceList = [...new Set(spaceList)]
  spaceList.sort()

useEffect(()=>{
  var rows: JSX.Element[] = []
  for (let i = 0; i<spaceList.length; i++){
    if ((input!='')&&(spaceList[i].toLowerCase().indexOf(input.toLowerCase())!=-1)){
      rows.push(
        <div key={i} className="hover:bg-[#eee] py-[6px] px-[20px] border-t-[1px] border-t-[#bbb] border-t-solid text-[0.9rem] cursor-pointer bg-white">
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
        return (
          <Label key={space.name} target={space.center} text={space.name} />
        )
      })}
      <div className="top-0 p-[20px] flex flex-row items-center justify-center fixed box-border w-[400px] top-0 max-w-screen">
        <div className="focus-within:border-[#4ad] bg-white border-2 border-solid border-[#ddd] rounded-[15px] p-0 flex flex-col items-center justify-center grow overflow-hidden">
          <div className="bg-white flex flex-row items-center justify-center grow gap-[10px] w-full py-[10px] px-[20px] box-border">
            <IoIosSearch/>
            <input placeholder="Search WCI Maps" className="h-full text-[1rem] b-0 grow focus:outline-none" value={input} onChange={(e)=>{setInput(e.target.value)}}/>
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
  console.log(import.meta.env.VITE_MY_KEY)
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
