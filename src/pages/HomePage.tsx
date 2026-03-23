import PageContainer from "../components/common/PageContainer";

function HomePage() {
  return (
    <PageContainer
      title="Welcome to Meal Share"
      description="Discover restaurants, share meal experiences, and help others decide what to order."
    >
      <div className="card">
        <h2 className="card__title">Project MVP Direction</h2>
        <p className="card__text">
          This app will let users browse restaurants, review meals, and vote on
          restaurants they want added to the platform.
        </p>
      </div>
    </PageContainer>
  );
}

export default HomePage;