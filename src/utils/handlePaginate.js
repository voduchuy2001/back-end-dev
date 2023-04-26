const paginateSearch = async (model, searchText, options) => {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const filterOptions = {};
    if (searchText) {
        filterOptions.$or = Object.keys(model.schema.paths).filter((path) => {
            const type = model.schema.paths[path].instance;
            return ['String', 'Array'].includes(type) && !['_id', '__v'].includes(path);
        }).map((path) => ({ [path]: { $regex: searchText, $options: 'i' } }));
    }

    const totalDocs = await model.countDocuments(filterOptions);
    const totalPages = Math.ceil(totalDocs / limit);

    const results = await model.find(filterOptions).skip(skip).limit(limit);

    return {
        results,
        totalDocs,
        totalPages,
        page,
        limit,
    };
};

module.exports = {
    paginateSearch,
}