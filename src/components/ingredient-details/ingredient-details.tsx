import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { ingredientsSelector } from '@slices';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredientsState = useSelector(ingredientsSelector);
  const ingredientId = useParams().id;
  const isLoading = ingredientsState.isLoading;
  const location = useLocation();
  const isModal = location.state?.background;
  const ingredientData = ingredientsState.ingredients.find((ingredient) => {
    if (ingredient._id === ingredientId) {
      return ingredient;
    }
  });

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div>
      {!isModal && (
        <h2
          className='text text_type_main-large mb-6'
          style={{ textAlign: 'center', paddingTop: '120px' }}
        >
          Детали ингредиента
        </h2>
      )}
      <div
        style={
          isModal
            ? {}
            : {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }
        }
      >
        <IngredientDetailsUI ingredientData={ingredientData} />
      </div>
    </div>
  );
};
