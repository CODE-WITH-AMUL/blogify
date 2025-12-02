

function LoadingSpinner({ small, message }) {
  return (
    <div className={`loading-spinner ${small ? 'small' : ''}`}>
      <div className="spinner" />
      {message && <p>{message}</p>}
    </div>
  );
}
export default LoadingSpinner;