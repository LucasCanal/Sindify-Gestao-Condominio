const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20))
    const skip = (page - 1) * limit
    return { page, limit, skip }
  }
  
  const paginatedResponse = (data, total, page, limit) => {
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }
  }
  
  module.exports = { getPagination, paginatedResponse }