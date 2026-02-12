import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Networks
  const networks = await Promise.all([
    prisma.network.create({
      data: {
        name: 'Global Network',
        description: 'The main network for all users worldwide',
      },
    }),
    prisma.network.create({
      data: {
        name: 'Enterprise Network',
        description: 'Professional enterprise solutions and insights',
      },
    }),
    prisma.network.create({
      data: {
        name: 'Community Network',
        description: 'Local community news and updates',
      },
    }),
  ]);
  console.log(`✅ Created ${networks.length} Networks`);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'All things tech',
        color: '#3498db',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business',
        slug: 'business',
        description: 'Business news and insights',
        color: '#2ecc71',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Science',
        slug: 'science',
        description: 'Scientific discoveries and research',
        color: '#9b59b6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Health',
        slug: 'health',
        description: 'Health and wellness topics',
        color: '#e74c3c',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Education',
        slug: 'education',
        description: 'Learning and educational content',
        color: '#f39c12',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Environment',
        slug: 'environment',
        description: 'Environmental news and sustainability',
        color: '#16a085',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Culture',
        slug: 'culture',
        description: 'Arts, culture, and entertainment',
        color: '#e67e22',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports news and updates',
        color: '#34495e',
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} Categories`);

  // Create Articles
  const articlesData = [
    {
      title: 'The Future of Artificial Intelligence',
      content: 'Artificial Intelligence is evolving rapidly, transforming industries from healthcare to finance. Machine learning algorithms are becoming more sophisticated, enabling computers to learn from data and make predictions with unprecedented accuracy. Deep learning, a subset of AI, has revolutionized image recognition, natural language processing, and autonomous systems. As we look ahead, AI promises to solve complex problems, but also raises important ethical questions about privacy, bias, and the future of work.',
      excerpt: 'Exploring how AI is reshaping our world and what the future holds',
      author: 'Jane Doe',
      network: networks[0].id,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-01-15'),
      categoryIds: [categories[0].id, categories[2].id],
    },
    {
      title: 'Sustainable Business Practices in 2024',
      content: 'Companies worldwide are embracing sustainability as a core business strategy. From reducing carbon footprints to implementing circular economy principles, businesses are finding that environmental responsibility and profitability can go hand in hand. This shift is driven by consumer demand, regulatory pressure, and the recognition that sustainable practices are essential for long-term success.',
      excerpt: 'How modern businesses are integrating sustainability into their operations',
      author: 'John Smith',
      network: networks[1].id,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-01-20'),
      categoryIds: [categories[1].id, categories[5].id],
    },
    {
      title: 'Breakthrough in Quantum Computing',
      content: 'Researchers have achieved a major milestone in quantum computing, demonstrating quantum supremacy in solving complex mathematical problems. This breakthrough could revolutionize cryptography, drug discovery, and optimization problems that are currently intractable for classical computers. The implications for science and technology are profound.',
      excerpt: 'Scientists achieve quantum supremacy with new computing breakthrough',
      author: 'Dr. Sarah Johnson',
      network: networks[0].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-02-01'),
      categoryIds: [categories[0].id, categories[2].id],
    },
    {
      title: 'Mental Health in the Digital Age',
      content: 'The rise of social media and constant connectivity has created new challenges for mental health. While technology offers unprecedented access to mental health resources and support communities, it also contributes to anxiety, depression, and social isolation. Experts emphasize the importance of digital wellness and finding balance in our increasingly connected world.',
      excerpt: 'Navigating mental wellness in an always-connected society',
      author: 'Dr. Michael Chen',
      network: networks[2].id,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-02-05'),
      categoryIds: [categories[3].id, categories[0].id],
    },
    {
      title: 'The Rise of Online Learning Platforms',
      content: 'Education is undergoing a digital transformation. Online learning platforms are democratizing access to knowledge, offering courses from world-class institutions to anyone with an internet connection. Adaptive learning technologies personalize the educational experience, while virtual reality creates immersive learning environments. The future of education is flexible, accessible, and technology-driven.',
      excerpt: 'How digital platforms are revolutionizing education worldwide',
      author: 'Emily Rodriguez',
      network: networks[0].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-02-10'),
      categoryIds: [categories[4].id, categories[0].id],
    },
    {
      title: 'Climate Change: The Tipping Point',
      content: 'Scientists warn that we are approaching critical tipping points in the Earth\'s climate system. Rising global temperatures, melting ice caps, and extreme weather events are becoming more frequent and severe. Urgent action is needed to reduce greenhouse gas emissions and transition to renewable energy sources. The decisions we make today will determine the future of our planet.',
      excerpt: 'Understanding the urgency of climate action and environmental protection',
      author: 'Dr. James Wilson',
      network: networks[0].id,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-02-12'),
      categoryIds: [categories[5].id, categories[2].id],
    },
    {
      title: 'The Renaissance of Indie Music',
      content: 'Independent artists are thriving in the streaming era. Digital platforms have eliminated traditional gatekeepers, allowing musicians to reach global audiences directly. From bedroom producers to DIY labels, the indie music scene is more vibrant and diverse than ever. This democratization of music production and distribution is reshaping the entire industry.',
      excerpt: 'How independent artists are redefining the music industry',
      author: 'Alex Martinez',
      network: networks[2].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-02-15'),
      categoryIds: [categories[6].id],
    },
    {
      title: 'Olympic Games 2024: Preview and Predictions',
      content: 'As the world prepares for the upcoming Olympic Games, athletes from around the globe are training for their moment on the world stage. New sports have been added to the program, reflecting the evolving nature of athletic competition. From traditional track and field to modern urban sports, the Olympics continue to captivate billions of viewers worldwide.',
      excerpt: 'A comprehensive look at the upcoming Olympic Games',
      author: 'Tom Anderson',
      network: networks[2].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-02-18'),
      categoryIds: [categories[7].id],
    },
    {
      title: 'Blockchain Beyond Cryptocurrency',
      content: 'While blockchain technology gained fame through Bitcoin, its applications extend far beyond digital currency. Supply chain management, healthcare records, voting systems, and digital identity verification are just a few areas where blockchain is creating transparent, secure, and decentralized solutions. The technology is still evolving, but its potential to transform industries is undeniable.',
      excerpt: 'Exploring the diverse applications of blockchain technology',
      author: 'Lisa Park',
      network: networks[1].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-02-20'),
      categoryIds: [categories[0].id, categories[1].id],
    },
    {
      title: 'The Future of Remote Work',
      content: 'The pandemic accelerated a workplace revolution that shows no signs of reversing. Remote and hybrid work models are now the norm for many industries. Companies are rethinking office spaces, collaboration tools, and work-life balance. This shift has implications for urban planning, real estate, and the very nature of professional relationships.',
      excerpt: 'How remote work is permanently changing the workplace landscape',
      author: 'David Kim',
      network: networks[1].id,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-02-22'),
      categoryIds: [categories[1].id, categories[0].id],
    },
    {
      title: 'Gene Editing: Promise and Peril',
      content: 'CRISPR and other gene-editing technologies offer the potential to cure genetic diseases, enhance crop yields, and even reverse aging. However, these powerful tools also raise profound ethical questions about designer babies, genetic inequality, and the limits of human intervention in nature. Society must grapple with these issues as the technology advances.',
      excerpt: 'The ethical implications of revolutionary gene-editing technology',
      author: 'Dr. Rachel Green',
      network: networks[0].id,
      status: 'draft',
      featured: false,
      publishedAt: null,
      categoryIds: [categories[2].id, categories[3].id],
    },
    {
      title: 'Nutrition Science: Debunking Common Myths',
      content: 'Nutrition advice seems to change constantly, leaving many confused about what to eat. This article examines the science behind common dietary recommendations, separating evidence-based guidance from popular myths. From intermittent fasting to superfoods, we explore what research actually tells us about optimal nutrition.',
      excerpt: 'Evidence-based insights into nutrition and healthy eating',
      author: 'Dr. Amanda Foster',
      network: networks[2].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-02-25'),
      categoryIds: [categories[3].id],
    },
    {
      title: 'The Metaverse: Hype or Reality?',
      content: 'Tech companies are investing billions in building the metaverse, a persistent virtual world where people can work, play, and socialize. But is this vision achievable, or just another tech bubble? We examine the current state of virtual reality, augmented reality, and the infrastructure needed to make the metaverse a reality.',
      excerpt: 'Separating metaverse fact from fiction in the tech industry',
      author: 'Chris Taylor',
      network: networks[1].id,
      status: 'draft',
      featured: false,
      publishedAt: null,
      categoryIds: [categories[0].id, categories[1].id],
    },
    {
      title: 'Renewable Energy: The Global Transition',
      content: 'Solar, wind, and other renewable energy sources are becoming increasingly cost-competitive with fossil fuels. Countries around the world are setting ambitious targets for clean energy adoption. This transition is not just about environmental protection—it represents a massive economic opportunity and a fundamental shift in how we power our civilization.',
      excerpt: 'The worldwide shift toward sustainable energy sources',
      author: 'Maria Santos',
      network: networks[0].id,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-02-28'),
      categoryIds: [categories[5].id, categories[1].id],
    },
    {
      title: 'The Art of Storytelling in Cinema',
      content: 'From silent films to streaming series, storytelling techniques in visual media continue to evolve. Modern filmmakers blend traditional narrative structures with innovative technologies, creating immersive experiences that captivate audiences. We explore how the art of cinematic storytelling has changed and what makes a great film in the 21st century.',
      excerpt: 'How modern cinema is redefining the art of visual storytelling',
      author: 'Robert Chen',
      network: networks[2].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-03-01'),
      categoryIds: [categories[6].id],
    },
    {
      title: 'Youth Sports: Development vs. Competition',
      content: 'Parents and coaches face difficult decisions about youth sports programs. Should the focus be on skill development and enjoyment, or early specialization and competitive success? Research shows that early specialization can lead to burnout and injury, while multi-sport participation builds well-rounded athletes. Finding the right balance is crucial for long-term athletic and personal development.',
      excerpt: 'Balancing competition and development in youth athletics',
      author: 'Coach Jennifer Lee',
      network: networks[2].id,
      status: 'archived',
      featured: false,
      publishedAt: new Date('2024-01-10'),
      categoryIds: [categories[7].id, categories[3].id],
    },
    {
      title: 'Cybersecurity in an AI World',
      content: 'As artificial intelligence becomes more sophisticated, so do cyber threats. AI-powered attacks can adapt and evolve faster than traditional security measures can respond. At the same time, AI is also being used to defend against these threats, creating an ongoing arms race in cybersecurity. Organizations must stay vigilant and invest in next-generation security solutions.',
      excerpt: 'The evolving landscape of AI-driven cybersecurity threats and defenses',
      author: 'Kevin Zhang',
      network: networks[1].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-03-05'),
      categoryIds: [categories[0].id, categories[1].id],
    },
    {
      title: 'Lifelong Learning in the Modern Economy',
      content: 'The half-life of professional skills is shrinking rapidly. What you learned in school may be obsolete within a few years. Successful professionals embrace continuous learning, constantly updating their skills and knowledge. This article explores strategies for lifelong learning and how to stay relevant in a rapidly changing job market.',
      excerpt: 'Why continuous learning is essential for career success',
      author: 'Dr. Patricia Moore',
      network: networks[1].id,
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-03-08'),
      categoryIds: [categories[4].id, categories[1].id],
    },
    {
      title: 'Urban Farming: Growing Food in Cities',
      content: 'As cities grow, innovative solutions are needed to ensure food security. Urban farming, from rooftop gardens to vertical farms, is transforming how we think about agriculture. These projects not only provide fresh, local produce but also create green spaces, reduce food miles, and engage communities in sustainable practices.',
      excerpt: 'How urban agriculture is reshaping city landscapes and food systems',
      author: 'Marcus Johnson',
      network: networks[2].id,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-03-10'),
      categoryIds: [categories[5].id, categories[3].id],
    },
    {
      title: 'The Psychology of Social Media',
      content: 'Social media platforms are designed to capture and hold our attention. Understanding the psychological mechanisms behind likes, shares, and notifications can help us use these tools more mindfully. This article examines how social media affects our brains, our relationships, and our sense of self, offering strategies for healthier digital habits.',
      excerpt: 'Understanding the psychological impact of social media on our lives',
      author: 'Dr. Sophie Williams',
      network: networks[0].id,
      status: 'draft',
      featured: false,
      publishedAt: null,
      categoryIds: [categories[3].id, categories[0].id],
    },
  ];

  const articles = [];
  for (const articleData of articlesData) {
    const { categoryIds, ...data } = articleData;
    const article = await prisma.article.create({
      data: {
        ...data,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });
    articles.push(article);
  }
  console.log(`✅ Created ${articles.length} Articles`);

  // Summary
  console.log('\n📊 Seeding Summary:');
  console.log(`   Networks: ${networks.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Articles: ${articles.length}`);
  console.log('   - Published: ' + articles.filter(a => a.status === 'published').length);
  console.log('   - Draft: ' + articles.filter(a => a.status === 'draft').length);
  console.log('   - Archived: ' + articles.filter(a => a.status === 'archived').length);
  console.log('   - Featured: ' + articles.filter(a => a.featured).length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
