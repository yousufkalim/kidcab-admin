const View = ({ url }) => {
  //const [user, setUser] = useState();
  return (
    <>
      {console.log("url", url)}
      {url && (
        <a href={process.env.REACT_APP_BASE_URL + url} target="_blank">
          &nbsp;
          <i className="fa fa-eye" />
        </a>
      )}
    </>
  );
};

export default View;
