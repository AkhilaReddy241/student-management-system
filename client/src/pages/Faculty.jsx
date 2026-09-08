import { useNavigate } from "react-router-dom";

function Faculty() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-5">
        Faculty Management
      </h2>

      <div className="d-flex justify-content-center gap-4">
        
            <div>
                 
               <h1>👨‍🏫</h1>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/faculty/add")}
        >
          Add Faculty
        </button>
              
              </div>

          <div>

            
        <h1>📚</h1>


        <button
          className="btn btn-success btn-lg"
          onClick={() => navigate("/faculty/subjects")}
        >
          Subject Management
        </button>
        </div>

      </div>

    </div>
  );
}

export default Faculty;