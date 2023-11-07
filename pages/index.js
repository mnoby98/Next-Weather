import textError from "@/components/textError";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

// Weather Icon
function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

// Form day (Sat,Sun,...)
function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

// Getting Location to get weather
async function gettingData(location) {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
    );
    const data = await res.json();

    const { latitude, longitude, timezone, name, country_code } =
      data?.results?.at(0);
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
    );
    const weatherData = await weatherRes.json();
    return weatherData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//Static fetch with ip in SSR
export async function getStaticProps() {
  const res = await fetch("https://ipapi.co/json/");
  const userData = await res.json();
  const userCity = userData?.city;
  const resLocation = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${userCity}`
  );
  const data = await resLocation.json();

  const { latitude, longitude, timezone, country_name, country_code } =
    data?.results?.at(0);
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
  );
  const weatherData = await weatherRes.json();
  return { props: { data: weatherData, city: userCity } };
}

const Home = ({ data, city }) => {
  const [dataFromApi, setDataFromAPi] = useState(data);
  const initialValues = {
    city: city || "",
  };
  const validationSchema = Yup.object({
    city: Yup.string()
      .min(3, "Enter more than 3 letters")
      .required("Enter City/Country "),
  });
  const onSubmit = async (values) => {
    const returnedData = await gettingData(values.city);
    setDataFromAPi(returnedData);
  };

  const dailyWeatherMax = dataFromApi?.daily.temperature_2m_max;
  const dailyWeatherMin = dataFromApi?.daily.temperature_2m_min;
  const dailytime = dataFromApi?.daily.time;
  const dailyCode = dataFromApi?.daily?.weathercode;

  return (
    <div className="  text-center   px-5  py-2  absolute gap-8 lg:px-32  lg:text-4xl   sm:py-24   top-[50%] left-[50%] translate-y-[-50%]  border-black  translate-x-[-50%] border-double border-8  ">
      <h1 className="Xtext-4xl font-serif mb-10">Next Weather</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form className=" sm:gap-2 px-2   lg:text-3xl   gap-1 justify-center items-center flex flex-col  sm:text-2xl text-xl ">
              <p>Search with your Location</p>
              <Field
                type="text"
                name="city"
                id="city"
                placeholder="Cairo"
                className=" text-center rounded-lg max-w-[300px] bg-slate-200 px-2 focus:outline-none sm:text-2xl text-xl  "
              />
              <ErrorMessage name="city" component={textError} />
              <div className="flex gap-6 py-2    sm:text-3xl text-lg sm:flex-nowrap flex-wrap">
                {dailytime?.map((day, i) => (
                  <Day
                    key={day}
                    day={day}
                    max={dailyWeatherMax[i]}
                    min={dailyWeatherMin[i]}
                    code={dailyCode[i]}
                    isToday={i === 0}
                  />
                ))}
              </div>
              <button
                disabled={formik.isSubmitting === true}
                type="submit"
                className="my-3  px-3 py-1 rounded-full bg-black text-white"
              >
                {formik.isSubmitting === true ? "Loading..." : "Get Weather"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Home;

function Day({ max, min, code, isToday, day }) {
  const getIcon = getWeatherIcon(code);

  return (
    <div
      className={`flex flex-col gap-1 ${
        isToday ? "bg-red-400 px-2 py-1 rounded-md" : ""
      }`}
    >
      <p>{isToday ? "Today" : formatDay(day)}</p>
      <span>{getIcon}</span>
      <p>{max}</p>
      <p>{min}</p>
    </div>
  );
}
