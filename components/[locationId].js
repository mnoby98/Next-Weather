// const LocationId = () => {
//   return <div>Location</div>;
// };

// export default LocationId;

// export async function getStaticPaths() {
//   const res = await fetch(
//     `https://geocoding-api.open-meteo.com/v1/search?name=cairo`
//   );
//   const data = await res.json();

//   if (!res.ok) throw new Error("error with api");

//   const locationData = data?.results;
//   console.log("locationData", locationData[0]?.name);
//   // const paths = {
//   //   params: [locationData[0].id.toString()],
//   // };
//   // const paths = locationData.slice(0, 1).map((location) => {
//   //   {
//   //     return { params: { locationId: location.name.toString() } };
//   //   }
//   // });
//   // const path = { params: { locationId: "egypt" } };
//   return {
//     paths: [
//       { params: { locationId: locationData[0]?.name } },
//       { params: { locationId: "2" } },
//       { params: { locationId: "3" } },
//     ],
//     fallback: true,
//   };

//   // return { fallback: false, paths: [{ locationId: locationData.name }] };
// }

// export async function getStaticProps(context) {
//   const locationId = context.params;
//   const res = await fetch(
//     `https://geocoding-api.open-meteo.com/v1/search?name=${locationId}`
//   );
//   const data = await res.json();
//   if (!res.ok) throw new Error("error with api");
//   const locationData = data.results[0];
//   return {
//     props: {
//       location: "test",
//     },
//   };
// }
