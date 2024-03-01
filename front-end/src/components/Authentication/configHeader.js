export const configAuth = (user) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
  }
}

export const config = {
  headers: {
    'Content-Type': 'application/json',
  },
}
