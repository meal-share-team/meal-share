import PageContainer from "../components/common/PageContainer";

function ReviewsPage() {
  return (
    <PageContainer
      title="Reviews"
      description="Read what users liked and disliked about different meals and restaurant experiences."
    >
      <div className="card">
        <h2 className="card__title">Coming Soon</h2>
        <p className="card__text">
          This page will later show meal ratings, review cards, and sorting by
          popularity or recency.
        </p>
      </div>
    </PageContainer>
  );
}

export default ReviewsPage;