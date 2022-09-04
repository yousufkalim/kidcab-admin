import { baseUrl } from 'config';

const View = ({ url }) => {
  //const [user, setUser] = useState();
  return (
    <>
      {url && (
        <a href={baseUrl + url} target="_blank">
          &nbsp;
          <i className="fa fa-eye" />
        </a>
      )}
    </>
  );
};

export default View;
