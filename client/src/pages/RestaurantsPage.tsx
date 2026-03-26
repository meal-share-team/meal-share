import PageContainer from "../components/common/PageContainer";

function RestaurantsPage() {
  return (
    <PageContainer
      title="Restaurants"
      description="Browse restaurant listings and eventually view menus and item-specific reviews."
    >
      <div className="card">
        <h2 className="card__title">Coming Soon</h2>
        <p className="card__text">
          This page will later display restaurant cards, search, and filtering.
        </p>
      </div>
    </PageContainer>
  );
}

export default RestaurantsPage;