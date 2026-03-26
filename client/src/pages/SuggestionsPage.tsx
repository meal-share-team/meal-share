import PageContainer from "../components/common/PageContainer";

function SuggestionsPage() {
  return (
    <PageContainer
      title="Restaurant Suggestions"
      description="Users will be able to suggest restaurants and vote on which ones should be added next."
    >
      <div className="card">
        <h2 className="card__title">Coming Soon</h2>
        <p className="card__text">
          This page will later support community voting and restaurant outreach
          prioritization.
        </p>
      </div>
    </PageContainer>
  );
}

export default SuggestionsPage;