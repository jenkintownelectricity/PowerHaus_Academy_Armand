import { db } from './index';
import {
  users, classes, materials, handsOnStations,
  enrollments, discussions, discussionReplies, blogPosts
} from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create users
  console.log('Creating users...');

  // Create admin user
  const admin = await db.insert(users).values({
    email: 'admin@spulms.com',
    password: 'admin123', // In production, this should be hashed
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  }).returning();

  const teacher = await db.insert(users).values({
    email: 'teacher@spu.edu',
    password: 'password123', // In production, this should be hashed
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'teacher',
  }).returning();

  const studentData = [
    { email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', extraCreditPoints: 15 },
    { email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', extraCreditPoints: 25 },
    { email: 'mike.wilson@student.com', firstName: 'Mike', lastName: 'Wilson', extraCreditPoints: 10 },
    { email: 'emily.brown@student.com', firstName: 'Emily', lastName: 'Brown', extraCreditPoints: 30 },
    { email: 'david.lee@student.com', firstName: 'David', lastName: 'Lee', extraCreditPoints: 20 },
    { email: 'sarah.martinez@student.com', firstName: 'Sarah', lastName: 'Martinez', extraCreditPoints: 5 },
    { email: 'chris.anderson@student.com', firstName: 'Chris', lastName: 'Anderson', extraCreditPoints: 35 },
    { email: 'lisa.taylor@student.com', firstName: 'Lisa', lastName: 'Taylor', extraCreditPoints: 15 },
    { email: 'robert.thomas@student.com', firstName: 'Robert', lastName: 'Thomas', extraCreditPoints: 40 },
    { email: 'jennifer.white@student.com', firstName: 'Jennifer', lastName: 'White', extraCreditPoints: 10 },
    { email: 'michael.harris@student.com', firstName: 'Michael', lastName: 'Harris', extraCreditPoints: 25 },
    { email: 'amanda.clark@student.com', firstName: 'Amanda', lastName: 'Clark', extraCreditPoints: 20 },
    { email: 'daniel.lewis@student.com', firstName: 'Daniel', lastName: 'Lewis', extraCreditPoints: 30 },
    { email: 'jessica.walker@student.com', firstName: 'Jessica', lastName: 'Walker', extraCreditPoints: 15 },
    { email: 'kevin.hall@student.com', firstName: 'Kevin', lastName: 'Hall', extraCreditPoints: 45 },
  ];

  const students = await db.insert(users).values(
    studentData.map(s => ({ ...s, password: 'password123', role: 'student' as const }))
  ).returning();

  // Create hands-on stations with detailed instructions
  console.log('Creating hands-on stations...');

  const stationsData = [
    {
      name: 'Decontamination Station',
      description: 'Learn proper instrument decontamination procedures following CDC guidelines',
      instructions: [
        'Put on appropriate PPE: gown, gloves, mask, and eye protection',
        'Prepare enzymatic detergent solution according to manufacturer instructions',
        'Receive contaminated instruments from the point of use',
        'Carefully place instruments in the decontamination sink',
        'Spray instruments with enzymatic spray to prevent drying',
        'Submerge instruments fully in enzymatic solution for proper contact time',
        'Using proper brush technique, scrub all surfaces, lumens, and hinges',
        'Pay special attention to serrations, box locks, and hard-to-reach areas',
        'Rinse instruments thoroughly under running water',
        'Dry instruments with lint-free towel before proceeding to next stage',
      ],
      questions: [
        {
          question: 'What is the primary purpose of using enzymatic detergent in decontamination?',
          options: [
            'To sterilize the instruments',
            'To break down organic material like blood and tissue',
            'To make instruments shiny',
            'To prevent rust formation'
          ],
          correctAnswer: 1
        },
        {
          question: 'When should PPE be worn in the decontamination area?',
          options: [
            'Only when handling sharp instruments',
            'Only during the actual cleaning process',
            'At all times when in the decontamination area',
            'PPE is optional in decontamination'
          ],
          correctAnswer: 2
        },
        {
          question: 'What is the correct order of decontamination steps?',
          options: [
            'Rinse, spray, scrub, dry',
            'Spray, scrub, rinse, dry',
            'Scrub, spray, rinse, dry',
            'Spray, rinse, scrub, dry'
          ],
          correctAnswer: 1
        },
        {
          question: 'Why must instruments be fully submerged in enzymatic solution?',
          options: [
            'To prevent them from floating',
            'To ensure complete contact with the cleaning solution',
            'To keep them organized',
            'To prevent cross-contamination'
          ],
          correctAnswer: 1
        },
        {
          question: 'What areas require special attention during manual cleaning?',
          options: [
            'Only the visible surfaces',
            'Serrations, box locks, lumens, and hard-to-reach areas',
            'Just the handles',
            'Only areas with visible soil'
          ],
          correctAnswer: 1
        }
      ],
      targetTime: 15,
      passingScore: 80,
      isActive: true,
    },
    {
      name: 'Cleaning Verification',
      description: 'Master verification techniques for cleaning effectiveness',
      instructions: [
        'Select appropriate verification method (visual, chemical, or biological)',
        'Ensure adequate lighting for visual inspection',
        'Examine all surfaces systematically using magnification if needed',
        'Check for residual soil, stains, or biofilm',
        'Test hinges and moving parts for smooth operation',
        'Use chemical indicators if required by facility protocol',
        'Document any findings on verification log',
        'Return instruments for re-cleaning if verification fails',
        'Proceed to packaging only after successful verification',
        'Initial and date the verification checklist',
      ],
      questions: [
        {
          question: 'What is the first step in cleaning verification?',
          options: [
            'Chemical testing',
            'Visual inspection',
            'Biological testing',
            'Documentation'
          ],
          correctAnswer: 1
        },
        {
          question: 'What indicates failed cleaning verification?',
          options: [
            'Shiny appearance',
            'Presence of residual soil or stains',
            'Smooth hinge operation',
            'Proper documentation'
          ],
          correctAnswer: 1
        },
        {
          question: 'What should be done if an instrument fails verification?',
          options: [
            'Package it anyway',
            'Return it for re-cleaning',
            'Mark it as clean',
            'Send it directly to sterilization'
          ],
          correctAnswer: 1
        },
        {
          question: 'Why is adequate lighting important for verification?',
          options: [
            'To save energy',
            'To detect residual soil and defects',
            'For staff comfort',
            'To prevent eye strain'
          ],
          correctAnswer: 1
        },
        {
          question: 'What must be checked on hinged instruments?',
          options: [
            'Color',
            'Weight',
            'Smooth operation of moving parts',
            'Temperature'
          ],
          correctAnswer: 2
        }
      ],
      targetTime: 15,
      passingScore: 80,
      isActive: false,
    },
    {
      name: 'Packaging Station',
      description: 'Practice proper packaging and wrapping techniques for sterilization',
      instructions: [
        'Select appropriate packaging material for the sterilization method',
        'Inspect packaging material for tears, holes, or defects',
        'Assemble instrument set according to standardized set list',
        'Place instruments in open position with ratchets unlocked',
        'Add chemical indicator inside the package',
        'Wrap package using proper sequential wrap technique',
        'Ensure adequate air removal and proper seal formation',
        'Label package with contents, date, load number, and initials',
        'Verify that package size allows adequate steam penetration',
        'Document package information in tracking system',
      ],
      questions: [
        {
          question: 'Why should hinged instruments be packaged in an open position?',
          options: [
            'To save space',
            'To allow steam penetration to all surfaces',
            'To prevent rust',
            'To make them easier to identify'
          ],
          correctAnswer: 1
        },
        {
          question: 'What should be done if packaging material has a small tear?',
          options: [
            'Use tape to repair it',
            'Use it anyway if the tear is small',
            'Discard it and use new material',
            'Cover the tear with another layer'
          ],
          correctAnswer: 2
        },
        {
          question: 'Where should the chemical indicator be placed?',
          options: [
            'On top of the package',
            'Outside the package',
            'Inside the package',
            'On the sterilizer door'
          ],
          correctAnswer: 2
        },
        {
          question: 'What information must be on the package label?',
          options: [
            'Only the date',
            'Contents, date, load number, and operator initials',
            'Just the contents',
            'Only the operator name'
          ],
          correctAnswer: 1
        },
        {
          question: 'Why is proper air removal from packages important?',
          options: [
            'To reduce package size',
            'To prevent packages from floating',
            'To ensure adequate steam penetration and sterilization',
            'To make packages easier to stack'
          ],
          correctAnswer: 2
        }
      ],
      targetTime: 15,
      passingScore: 80,
      isActive: false,
    },
    {
      name: 'Sterilization Loading',
      description: 'Learn correct autoclave loading procedures and cycle selection',
      instructions: [
        'Verify sterilizer has completed any previous cycle',
        'Check sterilizer chamber for cleanliness and proper function',
        'Select appropriate cycle based on package contents and materials',
        'Load packages on edge, not flat, to allow steam circulation',
        'Ensure adequate space between packages (minimum 1-2 inches)',
        'Place larger/heavier packages on bottom rack',
        'Position packages to allow steam penetration from all sides',
        'Add biological indicator to the most challenging location',
        'Close and lock sterilizer door properly',
        'Start cycle and document load information',
      ],
      questions: [
        {
          question: 'How should packages be positioned in the sterilizer?',
          options: [
            'Stacked flat to save space',
            'On edge with space between them',
            'Tightly packed together',
            'Standing vertically only'
          ],
          correctAnswer: 1
        },
        {
          question: 'What is the minimum space required between packages?',
          options: [
            'No space needed',
            '1-2 inches',
            '6 inches',
            'Packages can touch'
          ],
          correctAnswer: 1
        },
        {
          question: 'Where should the biological indicator be placed?',
          options: [
            'Anywhere in the load',
            'Outside the sterilizer',
            'In the most challenging location for steam penetration',
            'On top of all packages'
          ],
          correctAnswer: 2
        },
        {
          question: 'Why should heavier packages be placed on the bottom rack?',
          options: [
            'To prevent crushing lighter packages',
            'For proper weight distribution and stability',
            'Because they are easier to reach',
            'To make unloading easier'
          ],
          correctAnswer: 1
        },
        {
          question: 'What must be verified before starting a sterilization cycle?',
          options: [
            'Only that the door is closed',
            'Chamber cleanliness, proper function, and appropriate cycle selection',
            'Just the temperature setting',
            'Only the time setting'
          ],
          correctAnswer: 1
        }
      ],
      targetTime: 15,
      passingScore: 80,
      isActive: false,
    },
    {
      name: 'Quality Control',
      description: 'Perform quality checks and documentation procedures',
      instructions: [
        'Review sterilization cycle printout for all parameters',
        'Verify that all cycle parameters were met (time, temperature, pressure)',
        'Check physical and chemical indicators for proper color change',
        'Examine packages for moisture, tears, or compromised seals',
        'Document results in quality assurance log',
        'Quarantine load if any parameters are not met',
        'Verify biological indicator results when available',
        'Release load only if all indicators pass',
        'Store sterile items in appropriate clean, dry area',
        'Complete all required documentation and maintain records',
      ],
      questions: [
        {
          question: 'What indicates a successful sterilization cycle?',
          options: [
            'Just proper temperature',
            'All parameters met: time, temperature, pressure, and indicator pass',
            'Only chemical indicator change',
            'Just the time requirement'
          ],
          correctAnswer: 1
        },
        {
          question: 'What should be done if a package shows moisture after sterilization?',
          options: [
            'Use it immediately',
            'Dry it with a towel',
            'Consider it contaminated and reprocess',
            'Store it separately'
          ],
          correctAnswer: 2
        },
        {
          question: 'When should a sterilization load be quarantined?',
          options: [
            'Never',
            'Always',
            'When any cycle parameters are not met',
            'Only on Mondays'
          ],
          correctAnswer: 2
        },
        {
          question: 'What is the purpose of biological indicators?',
          options: [
            'To verify sterilization of most resistant microorganisms',
            'To make the load heavier',
            'To change color',
            'To measure temperature only'
          ],
          correctAnswer: 0
        },
        {
          question: 'Where should sterile items be stored?',
          options: [
            'Anywhere convenient',
            'In a clean, dry area with controlled temperature',
            'In the decontamination area',
            'Outside the facility'
          ],
          correctAnswer: 1
        }
      ],
      targetTime: 15,
      passingScore: 80,
      isActive: false,
    },
  ];

  const stations = await db.insert(handsOnStations).values(stationsData).returning();

  // Create materials
  console.log('Creating educational materials...');
  const materialsData = [
    {
      title: 'Introduction to Sterile Processing',
      description: 'Comprehensive guide to sterile processing fundamentals',
      category: 'book_materials' as const,
      tags: ['fundamentals', 'introduction', 'textbook'],
      fileType: 'pdf',
      filePath: '/uploads/materials/intro-sterile-processing.pdf',
      fileSize: 5242880, // 5MB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Decontamination Best Practices',
      description: 'CDC guidelines and best practices for instrument decontamination',
      category: 'book_materials' as const,
      tags: ['decontamination', 'guidelines', 'safety'],
      fileType: 'pdf',
      filePath: '/uploads/materials/decontamination-guide.pdf',
      fileSize: 3145728, // 3MB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Sterilization Methods Comparison Chart',
      description: 'Excel comparison of different sterilization methods',
      category: 'book_materials' as const,
      tags: ['sterilization', 'reference', 'comparison'],
      fileType: 'excel',
      filePath: '/uploads/materials/sterilization-methods.xlsx',
      fileSize: 1048576, // 1MB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Proper Hand Hygiene Poster',
      description: 'Visual guide for proper hand washing technique',
      category: 'hands_on_station' as const,
      tags: ['hygiene', 'safety', 'poster'],
      fileType: 'image',
      filePath: '/uploads/materials/hand-hygiene-poster.jpg',
      fileSize: 524288, // 512KB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Instrument Identification Guide',
      description: 'Complete guide to identifying surgical instruments',
      category: 'book_materials' as const,
      tags: ['instruments', 'identification', 'reference'],
      fileType: 'pdf',
      filePath: '/uploads/materials/instrument-guide.pdf',
      fileSize: 8388608, // 8MB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Packaging Techniques Video Tutorial',
      description: 'Step-by-step video demonstration of proper packaging',
      category: 'hands_on_station' as const,
      tags: ['packaging', 'video', 'tutorial'],
      fileType: 'video',
      filePath: '/uploads/materials/packaging-tutorial.mp4',
      fileSize: 52428800, // 50MB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Quality Control Checklist',
      description: 'Daily quality control procedures checklist',
      category: 'hands_on_station' as const,
      tags: ['quality-control', 'checklist', 'daily'],
      fileType: 'pdf',
      filePath: '/uploads/materials/qc-checklist.pdf',
      fileSize: 524288, // 512KB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Sterilization Load Documentation',
      description: 'Templates for documenting sterilization loads',
      category: 'hands_on_station' as const,
      tags: ['documentation', 'templates', 'sterilization'],
      fileType: 'excel',
      filePath: '/uploads/materials/load-docs.xlsx',
      fileSize: 786432, // 768KB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Anatomy and Physiology for SPD',
      description: 'Essential anatomy knowledge for sterile processing',
      category: 'book_materials' as const,
      tags: ['anatomy', 'medical', 'fundamentals'],
      fileType: 'pdf',
      filePath: '/uploads/materials/anatomy-for-spd.pdf',
      fileSize: 10485760, // 10MB
      uploadedById: teacher[0].id,
    },
    {
      title: 'Infection Prevention and Control',
      description: 'Comprehensive guide to infection prevention in healthcare',
      category: 'book_materials' as const,
      tags: ['infection-control', 'safety', 'prevention'],
      fileType: 'pdf',
      filePath: '/uploads/materials/infection-prevention.pdf',
      fileSize: 6291456, // 6MB
      uploadedById: teacher[0].id,
    },
  ];

  await db.insert(materials).values(materialsData);

  // Create classes
  console.log('Creating classes...');
  const classesData = [
    {
      title: 'Introduction to Sterile Processing',
      description: 'Fundamentals of sterile processing and decontamination',
      type: 'hybrid' as const,
      teacherId: teacher[0].id,
      capacity: 20,
      enrolled: 8,
      scheduleDate: new Date('2025-02-01T09:00:00'),
      scheduleTime: '9:00 AM - 12:00 PM',
      duration: 180,
      price: 15000, // $150
    },
    {
      title: 'Advanced Decontamination Techniques',
      description: 'Deep dive into complex decontamination procedures',
      type: 'hands_on' as const,
      teacherId: teacher[0].id,
      capacity: 12,
      enrolled: 10,
      scheduleDate: new Date('2025-02-05T13:00:00'),
      scheduleTime: '1:00 PM - 4:00 PM',
      duration: 180,
      price: 20000, // $200
    },
    {
      title: 'Sterilization Methods and Monitoring',
      description: 'Comprehensive overview of sterilization technologies',
      type: 'online' as const,
      teacherId: teacher[0].id,
      capacity: 30,
      enrolled: 15,
      scheduleDate: new Date('2025-02-10T10:00:00'),
      scheduleTime: '10:00 AM - 11:30 AM',
      duration: 90,
      price: 10000, // $100
      isLive: false,
    },
    {
      title: 'Quality Assurance in SPD',
      description: 'Learn quality control and documentation procedures',
      type: 'hybrid' as const,
      teacherId: teacher[0].id,
      capacity: 18,
      enrolled: 12,
      scheduleDate: new Date('2025-02-15T09:00:00'),
      scheduleTime: '9:00 AM - 12:00 PM',
      duration: 180,
      price: 15000, // $150
    },
    {
      title: 'Surgical Instrument Identification',
      description: 'Master the identification of surgical instruments',
      type: 'hands_on' as const,
      teacherId: teacher[0].id,
      capacity: 15,
      enrolled: 14,
      scheduleDate: new Date('2025-02-20T14:00:00'),
      scheduleTime: '2:00 PM - 5:00 PM',
      duration: 180,
      price: 18000, // $180
    },
  ];

  await db.insert(classes).values(classesData);

  // Create discussions
  console.log('Creating community discussions...');
  const discussionsData = [
    {
      title: 'Best practices for instrument drying',
      content: 'What are your preferred methods for drying instruments after decontamination? I\'ve been using lint-free towels but wondering if there are better options.',
      category: 'tips' as const,
      tags: ['drying', 'instruments', 'best-practices'],
      authorId: students[0].id,
      hasHelpfulAnswer: true,
    },
    {
      title: 'Career opportunities after certification',
      content: 'Recently completed my certification and looking for advice on career paths. What positions did you pursue after getting certified?',
      category: 'alumni' as const,
      tags: ['career', 'certification', 'advice'],
      authorId: students[1].id,
      hasHelpfulAnswer: false,
    },
    {
      title: 'Question about sterilization indicators',
      content: 'Can someone explain the difference between chemical and biological indicators? When should each be used?',
      category: 'questions' as const,
      tags: ['sterilization', 'indicators', 'help'],
      authorId: students[2].id,
      hasHelpfulAnswer: true,
    },
  ];

  const discussionsPosts = await db.insert(discussions).values(discussionsData).returning();

  // Create discussion replies
  await db.insert(discussionReplies).values([
    {
      discussionId: discussionsPosts[0].id,
      content: 'I recommend using compressed air for hard-to-reach areas, followed by lint-free towels. Make sure instruments are completely dry before packaging!',
      authorId: teacher[0].id,
      isHelpful: true,
    },
    {
      discussionId: discussionsPosts[2].id,
      content: 'Chemical indicators respond to physical conditions (time, temp, steam) while biological indicators test for actual sterilization by using spores. Biological indicators are the gold standard and should be used at least weekly or with every implant load.',
      authorId: teacher[0].id,
      isHelpful: true,
    },
  ]);

  // Create blog posts
  console.log('Creating blog posts...');
  await db.insert(blogPosts).values([
    {
      title: 'The Future of Sterile Processing: Emerging Technologies',
      content: 'The field of sterile processing is evolving rapidly with new technologies like low-temperature sterilization systems, automated reprocessing systems, and advanced tracking technologies. These innovations are improving efficiency, safety, and patient outcomes...',
      category: 'industry_news' as const,
      authorId: teacher[0].id,
      isApproved: true,
      publishedAt: new Date('2025-01-15T10:00:00'),
    },
    {
      title: 'My Experience with the Hands-On Stations',
      content: 'Completing all five hands-on stations was challenging but incredibly rewarding. The decontamination station taught me the importance of proper PPE and systematic cleaning. Here are my top tips for success...',
      category: 'student_work' as const,
      authorId: students[0].id,
      isApproved: true,
      extraCreditAwarded: 10,
      publishedAt: new Date('2025-01-18T14:00:00'),
    },
    {
      title: 'Case Study: Preventing Surgical Site Infections',
      content: 'This case study examines how proper sterile processing procedures prevented a potential outbreak of surgical site infections at a major hospital. Key lessons learned include...',
      category: 'case_studies' as const,
      authorId: teacher[0].id,
      isApproved: true,
      publishedAt: new Date('2025-01-20T09:00:00'),
    },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`
    Created:
    - ${students.length + 1} users (${students.length} students + 1 teacher)
    - ${stations.length} hands-on stations
    - ${materialsData.length} educational materials
    - ${classesData.length} classes
    - ${discussionsData.length} discussions
    - 3 blog posts
  `);
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
