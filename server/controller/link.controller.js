const Link = require('../model/link.model');

// Add a new link for the logged-in user
exports.addLink = async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;
    if (!url || !title) {
      return res.status(400).json({ message: 'URL and title are required.' });
    }
    const link = new Link({
      userId: req.user._id,
      url,
      title,
      description,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      createdAt: new Date(),
    });
    await link.save();
    res.status(201).json(link);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add link', error: err.message });
  }
};

// Get all links for the logged-in user, with optional tag and search filters
exports.getLinks = async (req, res) => {
  try {
    const { tag, search } = req.query;
    const filter = { userId: req.user._id };
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
      ];
    }
    const links = await Link.find(filter).sort({ createdAt: -1 });
    // Format response as per example
    const formatted = links.map(l => ({
      id: l._id,
      url: l.url,
      title: l.title,
      description: l.description,
      tags: l.tags,
      createdAt: l.createdAt
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch links', error: err.message });
  }
};

// Update a link (only if it belongs to the user)
exports.updateLink = async (req, res) => {
  try {
    const linkId = req.params.id;
    const { title, description, tags, url } = req.body;
    const link = await Link.findOne({ _id: linkId, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    if (title !== undefined) link.title = title;
    if (description !== undefined) link.description = description;
    if (tags !== undefined) link.tags = Array.isArray(tags) ? tags : [tags];
    if (url !== undefined) link.url = url;
    await link.save();
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update link', error: err.message });
  }
};

// Delete a link (only if it belongs to the user)
exports.deleteLink = async (req, res) => {
  try {
    const linkId = req.params.id;
    const link = await Link.findOneAndDelete({ _id: linkId, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json({ message: 'Link deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete link', error: err.message });
  }
};
