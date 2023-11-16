import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import api from '../api';
import { Link, useParams } from 'react-router-dom';


const Dashboard = () => {
  const user = useParams()
  const username = user.username
  const { authTokens } = useContext(AuthContext);
  let [loading, setLoading] = useState(true);
  const [userRecipes, setUserRecipes] = useState([]);
  let [error, setError] = useState(null);

  const handleDelete = async (recipeId) => {
    try {
      const response = await api.delete(`/recipes/${recipeId}/delete`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
  
      if (response.status === 204) {
        // Recipe deleted successfully
        setUserRecipes(userRecipes.filter((recipe) => recipe.id !== recipeId));
        console.log('Recipe deleted successfully');
      } else {
        setError('Error deleting recipe. Please try again later.');
      }
    } catch (error) {
      console.error('An error occurred while deleting recipe:', error);
    }
  };


  useEffect(() => {
    let fetchUserRecipes = async () => {
      try {
        const response = await api.get('recipes/user-recipes/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`,
          },
        });
        if (response.status === 200) {
          setUserRecipes(response.data);
          setLoading(false)
        } else {
          console.error('Failed to fetch user recipes.');
          setError('Error fetching recipes. Please try again later.');
          setLoading(false);
        }
      } catch (error) {
        console.error('An error occurred while fetching user recipes', error);
      }
    };

    if (authTokens) {
      fetchUserRecipes();
    }
  }, [authTokens]);
  return (
    <div>
      <h2>Your Recipes</h2>
      {loading && <p>Loading recipes...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <ul className="recipe-items">
          {userRecipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                  onError={(e) => {
                      console.error('Error loading image:', e);
                    }}
                />
                <div className="recipe-details">
                  <h3>{recipe.title}</h3>
                  <p>Ingredients: {recipe.ingredients}</p>
                  <p>Instructions: {recipe.instructions}</p>
                </div>
              </Link>
              <div className='button-container'>
                <Link to={`/recipes/${recipe.id}/update`}>
                      <button>Edit Recipe</button>
                </Link>
                <button onClick={() => handleDelete(recipe.id)} className='delete-button'>Delete Recipe</button>
              </div>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard
