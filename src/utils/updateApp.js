const updatePlay = () => {
  let parsedData = JSON.parse(localStorage.getItem("player"));
  const data = {
    ...parsedData,
  };
  localStorage.setItem("player", JSON.stringify(data));
};

export default function () {
  updatePlay();
}
