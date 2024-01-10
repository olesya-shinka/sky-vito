function FormatTime({ date }) {
  const formatedDate = date ? new Date(date)?.toLocaleDateString() : date;

  return <>{formatedDate}</>;
}

export default FormatTime;
