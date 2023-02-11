const Notification = ({ message, className }) => {
  if (message === '') {
    return null
  } else {
    return <div className={className}>{message}</div>
  }
}

export default Notification
