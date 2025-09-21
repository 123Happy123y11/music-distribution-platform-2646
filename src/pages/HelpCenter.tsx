import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Search, Music, DollarSign, Settings, Users, HelpCircle, BookOpen, MessageSquare, ArrowLeft, ExternalLink } from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<{title: string, content: string, readTime: string} | null>(null);
  const { toast } = useToast();

  const toggleArticle = (article: string) => {
    setExpandedArticles(prev => 
      prev.includes(article) 
        ? prev.filter(a => a !== article)
        : [...prev, article]
    );
  };

  const categories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "New to SoundWave? Start here",
      color: "bg-blue-500",
      articles: 12
    },
    {
      title: "Music Distribution",
      icon: Music,
      description: "Upload and distribute your music",
      color: "bg-purple-500",
      articles: 18
    },
    {
      title: "Royalties & Payments",
      icon: DollarSign,
      description: "Understanding earnings and payouts",
      color: "bg-green-500",
      articles: 8
    },
    {
      title: "Account Settings",
      icon: Settings,
      description: "Manage your account and preferences",
      color: "bg-orange-500",
      articles: 6
    },
    {
      title: "Artist Services",
      icon: Users,
      description: "Promotional tools and artist support",
      color: "bg-pink-500",
      articles: 10
    },
    {
      title: "Technical Support",
      icon: HelpCircle,
      description: "Troubleshooting and technical help",
      color: "bg-red-500",
      articles: 15
    }
  ];

  const faqs = [
    {
      category: "General",
      question: "How long does it take for my music to appear on streaming platforms?",
      answer: "Your music typically appears on major streaming platforms within 24-48 hours after approval. Some platforms like Spotify and Apple Music usually process releases faster, while others may take up to 72 hours during peak periods."
    },
    {
      category: "Distribution",
      question: "Which streaming platforms do you distribute to?",
      answer: "We distribute to 150+ platforms worldwide including Spotify, Apple Music, Amazon Music, YouTube Music, Deezer, Tidal, TikTok, Instagram, Facebook, and many regional platforms across different countries."
    },
    {
      category: "Royalties",
      question: "When and how do I get paid?",
      answer: "Royalty payments are processed monthly, typically by the 15th of each month for the previous month's earnings. Payments are made via PayPal, bank transfer, or check (minimum $50 threshold applies)."
    },
    {
      category: "Distribution",
      question: "Can I distribute cover songs?",
      answer: "Yes, but you need to obtain a mechanical license first. We partner with services like Loudr and Easy Song Licensing to help you secure the proper rights before distribution."
    },
    {
      category: "General",
      question: "Do I keep the rights to my music?",
      answer: "Absolutely! You retain 100% ownership of your master recordings and publishing rights. SoundWave is a distribution service - we never claim ownership of your music."
    },
    {
      category: "Royalties",
      question: "What percentage of royalties do I keep?",
      answer: "Free plan users keep 85% of royalties, while paid plan subscribers keep 100% of their streaming and download royalties. There are no hidden fees or additional charges."
    },
    {
      category: "Technical",
      question: "What audio format should I upload?",
      answer: "We recommend uploading high-quality WAV files (44.1kHz/16-bit minimum) or FLAC files. MP3 files are accepted but may result in quality loss during processing."
    },
    {
      category: "Technical",
      question: "What are the artwork requirements?",
      answer: "Album artwork must be exactly 3000x3000 pixels, in RGB color mode, and saved as JPG or PNG. The image should be high quality with no pixelation or blurriness."
    }
  ];

  const popularArticles = [
    "How to optimize your music for streaming platforms",
    "Understanding streaming royalties and how they work",
    "Best practices for album artwork and metadata",
    "How to pitch your music to Spotify playlists",
    "Setting up pre-release campaigns",
    "Managing multiple artist profiles"
  ];

  // Articles organized by category
  const articlesByCategory: Record<string, Array<{title: string, content: string, fullContent: string, readTime: string}>> = {
    "Getting Started": [
      {
        title: "Welcome to SoundWave - Your First Steps",
        content: "Learn how to set up your account, upload your first track, and navigate the platform. This comprehensive guide covers everything you need to know to get started with music distribution.",
        fullContent: `# Welcome to SoundWave - Your First Steps

## Getting Started with Music Distribution

Welcome to SoundWave! This comprehensive guide will walk you through everything you need to know to start distributing your music to major streaming platforms worldwide.

### Step 1: Setting Up Your Account
- Create your artist profile with accurate information
- Upload a high-quality profile picture and banner
- Add your social media links and website
- Verify your email address

### Step 2: Uploading Your First Track
1. **Prepare your audio file** - Use high-quality WAV or FLAC format
2. **Create artwork** - 3000x3000 pixels, RGB color mode
3. **Fill in metadata** - Track title, artist name, album, genre
4. **Set release date** - Choose immediate or scheduled release
5. **Select territories** - Worldwide or specific regions

### Step 3: Platform Distribution
Your music will be distributed to:
- Spotify (usually live within 24 hours)
- Apple Music (24-48 hours)
- YouTube Music (24-72 hours)
- Amazon Music (48-72 hours)
- 140+ other platforms worldwide

### Step 4: Monitoring Your Release
- Check your dashboard for distribution status
- Monitor streaming numbers and analytics
- Set up payment preferences for royalties
- Promote your release on social media

### Tips for Success
- Always use high-quality audio files
- Create eye-catching artwork
- Plan your release strategy
- Engage with your audience
- Be patient - building an audience takes time

Remember, we're here to help! If you have any questions during the process, don't hesitate to contact our support team.`,
        readTime: "5 min read"
      },
      {
        title: "Setting Up Your Artist Profile",
        content: "Create a compelling artist profile that represents your brand. Learn how to add your bio, photos, social links, and contact information to attract fans and industry professionals.",
        fullContent: `# Setting Up Your Artist Profile

## Creating Your Digital Identity

Your artist profile is the first thing fans and industry professionals see when they discover your music. Here's how to make it compelling and professional.

### Profile Basics
- **Artist Name**: Choose a unique, memorable name
- **Bio**: Write a compelling 2-3 paragraph biography
- **Profile Photo**: Use a high-resolution, professional headshot
- **Banner Image**: Create a branded banner (1920x1080 pixels)

### Social Media Integration
Connect all your social platforms:
- Instagram
- Twitter/X  
- TikTok
- YouTube
- Facebook
- Website/Blog

### Contact Information
- Management contact
- Booking inquiries
- Press contact
- Collaboration opportunities

### Best Practices
1. Keep information current and accurate
2. Use consistent branding across all platforms
3. Include genre and location information
4. Add high-quality press photos
5. Update regularly with new releases

Your profile is your digital business card - make it count!`,
        readTime: "3 min read"
      },
      {
        title: "Understanding Music Distribution Basics",
        content: "Get familiar with how music distribution works, which platforms you'll reach, and what to expect after uploading your music to our service.",
        fullContent: `# Understanding Music Distribution Basics

## What is Music Distribution?

Music distribution is the process of getting your music from your computer to streaming platforms and digital stores worldwide. Here's everything you need to know.

### How Distribution Works
1. **Upload**: You provide audio files and metadata
2. **Processing**: We prepare your release for each platform
3. **Delivery**: Your music is sent to streaming services
4. **Publication**: Your tracks go live for listeners
5. **Reporting**: We collect and report streaming data

### Platforms We Reach
**Major Streaming Services:**
- Spotify (180M+ users)
- Apple Music (88M+ users)
- YouTube Music (50M+ users)
- Amazon Music (55M+ users)
- Deezer (16M+ users)

**Digital Stores:**
- iTunes
- Amazon MP3
- Bandcamp
- 7digital
- Qobuz

**Social Platforms:**
- TikTok
- Instagram
- Facebook
- Snapchat
- YouTube Content ID

### Timeline Expectations
- **Immediate**: Processing begins
- **24-48 hours**: Major platforms (Spotify, Apple Music)
- **48-72 hours**: Secondary platforms
- **Up to 1 week**: Regional platforms

### What You Need
- High-quality audio files (WAV/FLAC recommended)
- Album artwork (3000x3000 pixels)
- Complete metadata (titles, credits, ISRC codes)
- Release date and territory selection

Success in music distribution comes from preparation, patience, and promotion!`,
        readTime: "7 min read"
      }
    ],
    "Music Distribution": [
      {
        title: "Supported Audio Formats and Quality Requirements",
        content: "Learn about the technical requirements for uploading music, including supported formats (WAV, FLAC, MP3), bitrate recommendations, and file size limits.",
        fullContent: `# Audio Formats and Quality Requirements

## Ensuring Professional Quality Distribution

The quality of your upload directly impacts the final sound quality across all streaming platforms. Here are our technical specifications.

### Supported Audio Formats

**Recommended Formats:**
- **WAV**: 44.1kHz/16-bit minimum, 96kHz/24-bit optimal
- **FLAC**: Lossless compression, all sample rates supported
- **AIFF**: Apple's uncompressed format, equivalent to WAV

**Accepted Formats:**
- **MP3**: 320kbps minimum (quality loss may occur)
- **M4A**: 256kbps AAC minimum

### Quality Guidelines
- **Sample Rate**: 44.1kHz minimum (matches CD quality)
- **Bit Depth**: 16-bit minimum, 24-bit recommended
- **File Size**: Maximum 500MB per track
- **Length**: Maximum 30 minutes per track

### Technical Best Practices
1. **Master at high resolution** - Record and master at 48kHz/24-bit or higher
2. **Avoid over-compression** - Leave headroom for platform processing
3. **Check for clipping** - Ensure no digital distortion
4. **Normalize levels** - Peak around -1dB to -0.5dB
5. **Test on multiple systems** - Check how it sounds on different speakers

### Common Issues to Avoid
- Uploading low-quality MP3s
- Excessive limiting or compression
- Phase issues in stereo tracks
- Inconsistent levels between tracks
- Audio artifacts from poor conversion

Remember: Garbage in, garbage out. Start with the highest quality source possible!`,
        readTime: "4 min read"
      },
      {
        title: "Metadata Best Practices",
        content: "Proper metadata is crucial for your music's discoverability. Learn how to optimize track titles, artist names, genres, and tags for maximum reach.",
        fullContent: `# Metadata Best Practices

## Maximizing Discoverability Through Proper Tagging

Metadata is the information that helps listeners find your music. Getting it right is crucial for success on streaming platforms.

### Essential Metadata Fields

**Track Information:**
- Track Title (exactly as you want it displayed)
- Artist Name (consistent across all releases)  
- Album/EP Name
- Track Number and Total Tracks
- Genre and Subgenre
- Release Date
- Copyright Information

**Advanced Fields:**
- ISRC Code (International Standard Recording Code)
- UPC/EAN Barcode (for albums)
- Composer Credits
- Producer Credits
- Label Name
- Explicit Content Warning

### Optimization Tips

**Track Titles:**
- Use proper capitalization (Title Case)
- Avoid special characters unnecessarily  
- Include featured artists: "Song Title (feat. Artist Name)"
- Keep remix titles clear: "Song Title (Producer Remix)"

**Artist Names:**
- Be consistent across all platforms
- Use the same spelling and capitalization
- Avoid unnecessary punctuation
- Consider how fans will search for you

**Genres:**
- Choose the most accurate primary genre
- Use subgenres to be more specific
- Research what similar artists use
- Consider playlist placement strategies

### Platform-Specific Considerations
- **Spotify**: Optimizes for playlist placement based on genre
- **Apple Music**: Uses metadata for radio station placement  
- **YouTube Music**: Integrates with YouTube search
- **TikTok**: Tags help with music discovery features

### Common Mistakes
- Inconsistent artist names across releases
- Wrong or missing genre information
- Typos in track titles or credits
- Missing featured artist information
- Incorrect explicit content flags

Take time to get your metadata right - it's as important as the music itself!`,
        readTime: "6 min read"
      },
      {
        title: "Release Scheduling and Timing",
        content: "Strategic release timing can impact your music's success. Discover the best days and times to release music, and how to plan your release calendar.",
        fullContent: `# Release Scheduling and Timing

## Strategic Release Planning for Maximum Impact

When you release your music can be just as important as the music itself. Here's how to time your releases for success.

### Best Days to Release Music

**Industry Standards:**
- **Friday**: Global release day, optimal for chart placement
- **Thursday**: Gets ahead of Friday competition
- **Tuesday**: Traditional release day (still effective for some genres)

**Avoid:**
- **Monday**: Start of work week, lower engagement
- **Saturday/Sunday**: Reduced industry attention
- **Major Holidays**: Competing with holiday content

### Seasonal Considerations

**Spring (March-May):**
- Fresh start energy
- Good for upbeat, optimistic music
- Fewer major releases competing

**Summer (June-August):**
- Peak streaming season
- Festival season alignment
- Vacation and party music performs well

**Fall (September-November):**
- Back-to-school energy
- Industry ramp-up after summer
- Good for more serious/artistic releases

**Winter (December-February):**
- Holiday music dominates December
- January: Low competition, fresh start
- February: Building toward spring

### Release Strategy Planning

**Single Strategy:**
1. **Lead Single**: 6-8 weeks before album
2. **Second Single**: 3-4 weeks before album  
3. **Album Release**: Full collection
4. **Follow-up Singles**: 2-3 months post-album

**Timeline Best Practices:**
- Submit to playlists 4-6 weeks in advance
- Plan social media content calendar
- Coordinate with press and marketing
- Allow time for pre-release buzz building

### Platform-Specific Timing
- **Spotify**: Submit for playlist consideration 4+ weeks early
- **Apple Music**: Benefits from Tuesday releases
- **TikTok**: Time with trending hashtags and challenges
- **Radio**: Coordinate with radio promotion cycles

### Global Release Considerations
- Choose release time zone (usually EST or GMT)
- Consider international fan base locations
- Account for time zone differences in promotion
- Plan social media posts for multiple time zones

Remember: Consistency is key. Develop a release schedule and stick to it to build fan expectations!`,
        readTime: "5 min read"
      }
    ],
    "Royalties & Payments": [
      {
        title: "How Streaming Royalties Work",
        content: "Understand how streaming platforms calculate and distribute royalties, what affects your earnings, and how different platforms compare in terms of payout rates.",
        fullContent: `# How Streaming Royalties Work

## Understanding Your Digital Music Earnings

Streaming royalties can seem complex, but understanding the basics will help you maximize your earnings and plan your music career strategy.

### Types of Royalties

**Performance Royalties:**
- Generated every time your song is played
- Collected by Performance Rights Organizations (PROs)
- Split between songwriter and publisher

**Mechanical Royalties:**
- Generated from reproductions of your music
- Includes streaming, downloads, and physical sales
- Paid directly to songwriters and publishers

**Neighboring Rights:**
- Generated from public performance of sound recordings
- Paid to performers and record labels
- Not available in all countries

### How Platforms Calculate Payments

**Spotify Model:**
- Revenue pool divided by total streams
- Approximately $0.003-0.005 per stream
- Varies by country and subscription type

**Apple Music Model:**
- Fixed per-stream rate
- Approximately $0.01 per stream
- Higher rate but smaller user base

**YouTube Music:**
- Ad-supported and premium tiers
- $0.008 per stream average
- Revenue sharing with video content

### Factors Affecting Your Earnings

**Geographic Location:**
- Premium subscription rates vary by country
- Developed markets typically pay more
- Emerging markets have lower rates but growing audiences

**Listener Type:**
- Premium subscribers generate more revenue
- Free/ad-supported users generate less
- Family plans split revenue among users

**Platform Share:**
- Each platform takes 30-50% of gross revenue
- Your distributor takes 10-15% (or 0% on premium plans)
- You keep the remaining 40-85%

### Maximizing Your Royalty Income
1. Focus on platforms with higher per-stream rates
2. Build audience in high-paying territories
3. Encourage premium subscriptions
4. Register with collecting societies
5. Claim all your publishing rights

Remember: Streaming is a volume game. Build your audience and the royalties will follow!`,
        readTime: "8 min read"
      },
      {
        title: "Payment Methods and Schedules",
        content: "Learn about available payment options (PayPal, bank transfer, check), minimum payout thresholds, and when you can expect to receive your earnings.",
        fullContent: `# Payment Methods and Schedules

## Getting Paid for Your Music

Understanding when and how you'll receive your royalty payments is crucial for managing your music career finances.

### Payment Schedule

**Monthly Payments:**
- Royalties calculated monthly
- 2-month delay for data processing
- Example: January streams paid in March

**Payment Dates:**
- Processed on the 15th of each month
- Bank transfers: 3-5 business days
- PayPal: Instant transfer
- Checks: 7-14 business days

### Minimum Payout Thresholds

**Standard Thresholds:**
- PayPal: $10 minimum
- Bank Transfer: $50 minimum  
- Check: $100 minimum
- Earnings below threshold roll over to next month

### Available Payment Methods

**PayPal (Recommended):**
- Instant transfers
- Low minimum threshold
- Available worldwide
- Small processing fee ($0.30 + 2.9%)

**Direct Bank Transfer:**
- Higher threshold but no fees
- Available in most countries
- Requires banking information verification
- 3-5 business day processing

**Physical Check:**
- Highest threshold
- Available in select countries
- Mailed to registered address
- Longest processing time

### Setting Up Payments

**Required Information:**
- Government-issued ID verification
- Tax information (W-9 for US, W-8 for international)
- Banking or PayPal account details
- Mailing address for tax documents

**Tax Considerations:**
- Form 1099 issued for US earnings over $600
- International artists may be subject to withholding
- Keep records of all payments received
- Consult tax professional for advice

### Payment Tracking

**Your Dashboard Shows:**
- Current balance
- Payment history
- Pending payments
- Detailed earnings reports
- Platform breakdowns

### Troubleshooting Payment Issues
- Verify all account information is current
- Check spam folder for payment notifications
- Contact support for missing payments
- Update banking information as needed

Getting paid regularly helps fund your next musical projects!`,
        readTime: "4 min read"
      },
      {
        title: "Maximizing Your Revenue",
        content: "Discover strategies to increase your streaming revenue, including playlist placement, fan engagement tactics, and cross-platform promotion.",
        fullContent: `# Maximizing Your Revenue

## Strategic Approaches to Increase Your Music Earnings

While you can't control streaming rates, you can influence how much you earn through smart strategy and fan engagement.

### Playlist Strategy

**Editorial Playlists:**
- Submit to Spotify for Artists 4+ weeks before release
- Research relevant playlists in your genre
- Build relationships with playlist curators
- Focus on mood and theme, not just genre

**User Playlists:**
- Engage with playlist creators on social media
- Create your own themed playlists
- Cross-promote with other artists
- Use playlist placement services carefully

### Fan Engagement Tactics

**Build Direct Relationships:**
- Email newsletter with exclusive content
- Social media engagement and responses  
- Live streaming and virtual concerts
- Behind-the-scenes content creation

**Encourage Repeat Listening:**
- Create cohesive albums, not just singles
- Use storytelling across multiple tracks
- Release music videos and visualizers
- Offer exclusive versions and remixes

### Cross-Platform Promotion

**TikTok Strategy:**
- Create short, catchy hooks
- Participate in trending challenges
- Use relevant hashtags and sounds
- Collaborate with content creators

**YouTube Optimization:**
- Upload music videos and lyric videos
- Create consistent visual branding
- Use YouTube Shorts for promotion
- Enable monetization and Content ID

**Social Media Best Practices:**
- Maintain consistent posting schedule
- Share personal stories and processes
- Engage with other artists and fans
- Use platform-specific content formats

### Revenue Diversification

**Beyond Streaming:**
- Merchandise sales
- Live performance bookings
- Sync licensing opportunities
- Teaching and production services
- Crowdfunding and fan subscriptions

**Direct-to-Fan Platforms:**
- Bandcamp for higher margins
- Patreon for recurring revenue
- Direct merchandise sales
- Exclusive content offerings

### Analytics and Optimization

**Track Key Metrics:**
- Stream completion rates
- Geographic performance
- Platform-specific success
- Demographic insights

**Use Data to Improve:**
- Release timing optimization
- Geographic marketing focus
- Platform-specific content
- Genre and style refinement

### Long-term Growth Strategies
1. Consistency beats sporadic viral moments
2. Build your core fanbase in specific markets
3. Collaborate with complementary artists
4. Invest earnings back into better production
5. Stay authentic to your artistic vision

Remember: Revenue growth in music is a marathon, not a sprint. Focus on building lasting relationships with your audience!`,
        readTime: "10 min read"
      }
    ],
    "Account Settings": [
      {
        title: "Managing Your Account Preferences",
        content: "Customize your account settings, notification preferences, and privacy options to optimize your SoundWave experience.",
        fullContent: `# Managing Your Account Preferences

## Customizing Your SoundWave Experience

Personalizing your account settings ensures you get the most relevant information and the best user experience on our platform.

### Notification Settings

**Email Notifications:**
- Release status updates
- Royalty payment alerts
- Platform news and updates
- Marketing opportunities
- Technical announcements

**Dashboard Alerts:**
- Real-time streaming milestones
- New fan follows and saves
- Playlist additions
- Revenue thresholds reached

### Privacy Controls

**Profile Visibility:**
- Public profile (discoverable by fans)
- Private profile (internal use only)
- Selective information sharing
- Social media link management

**Data Sharing:**
- Analytics sharing with labels
- Third-party integration permissions
- Marketing communication preferences
- Research participation options

### Account Security

**Password Management:**
- Strong password requirements
- Two-factor authentication setup
- Login activity monitoring
- Suspicious activity alerts

**Connected Accounts:**
- Social media integrations
- Streaming platform connections
- Payment service authorizations
- Third-party app permissions

### Customization Options

**Dashboard Layout:**
- Widget arrangement preferences
- Default view settings
- Chart and graph preferences
- Report generation options

**Language and Region:**
- Interface language selection
- Currency display preferences
- Time zone settings
- Regional content filtering

### Data Management
- Export your data
- Download reports and analytics
- Backup contact information
- Manage stored payment methods

Keep your preferences updated to ensure optimal platform performance!`,
        readTime: "3 min read"
      },
      {
        title: "Upgrading and Downgrading Plans",
        content: "Learn how to change your subscription plan, understand the differences between plans, and manage billing information.",
        fullContent: `# Upgrading and Downgrading Plans

## Managing Your SoundWave Subscription

Understanding your plan options and how to change them helps you get the best value from our distribution services.

### Plan Comparison

**Free Plan:**
- Unlimited uploads
- 150+ platform distribution
- Basic analytics
- 85% revenue share
- Community support

**Professional Plan ($19.99/year):**
- Everything in Free
- 100% revenue share
- Advanced analytics
- Priority support
- Playlist pitching tools
- Custom release dates

**Label Plan ($99.99/year):**
- Everything in Professional
- Multiple artist management
- White-label options
- Advanced reporting
- Dedicated account manager
- Custom integrations

### Upgrading Your Plan

**When to Upgrade:**
- Earning more than $20/year in royalties
- Need advanced analytics features
- Want priority customer support
- Planning professional releases
- Managing multiple artists

**Upgrade Process:**
1. Navigate to Account Settings
2. Select "Subscription" tab
3. Choose your new plan
4. Enter payment information
5. Confirm upgrade

### Downgrading Your Plan

**Important Considerations:**
- Changes take effect at next billing cycle
- Advanced features become unavailable
- Revenue share percentage changes
- Export data before downgrading
- Contact support for assistance

**What Happens When You Downgrade:**
- Existing releases remain distributed
- Advanced analytics become limited
- Priority support ends
- Custom features disabled

### Billing Management

**Payment Methods:**
- Credit/debit cards
- PayPal payments
- Bank transfers (annual plans)
- Cryptocurrency (select regions)

**Billing Cycles:**
- Monthly billing (higher rate)
- Annual billing (significant discount)
- Automatic renewal by default
- Cancel anytime, no contracts

### Managing Subscription Changes

**Prorated Billing:**
- Upgrades charged immediately (prorated)
- Downgrades applied at cycle end
- Refunds for unused premium time
- Credit applied to next billing cycle

**Cancellation Policy:**
- Cancel anytime through dashboard
- Access continues until cycle end
- No cancellation fees
- Releases remain live

### Getting Help

**Contact Support For:**
- Plan recommendation guidance
- Billing questions or disputes  
- Technical issues with upgrades
- Custom plan requirements
- Volume discounts for labels

Choose the plan that matches your current needs - you can always change later!`,
        readTime: "4 min read"
      }
    ],
    "Artist Services": [
      {
        title: "Promotional Tools and Features",
        content: "Explore our built-in promotional tools including social media integration, playlist pitching, and marketing analytics to grow your audience.",
        fullContent: `# Promotional Tools and Features

## Amplifying Your Music's Reach

SoundWave provides comprehensive promotional tools to help you build your audience and increase your music's visibility across all platforms.

### Built-in Promotion Features

**Smart Links:**
- Single URL for all platforms
- Customizable landing pages
- Fan location-based redirects
- Click tracking and analytics
- Social media optimization

**Pre-Save Campaigns:**
- Build anticipation before release
- Automatic saves to fan libraries
- Email capture for marketing
- Social sharing incentives
- Release day notifications

### Playlist Pitching Tools

**Editorial Submissions:**
- Direct submissions to Spotify editors
- Genre and mood targeting
- Release strategy recommendations
- Submission tracking and feedback
- Success rate analytics

**Curator Database:**
- Independent playlist curator contacts
- Genre-specific playlists
- Submission templates
- Response tracking
- Relationship management

### Social Media Integration

**Automated Posting:**
- Release announcements
- Milestone celebrations
- Cross-platform sharing
- Scheduled content delivery
- Engagement tracking

**Content Creation Tools:**
- Audiogram generators
- Social media templates
- Quote card creators
- Behind-the-scenes prompts
- Story and post templates

### Analytics and Insights

**Audience Analytics:**
- Demographic breakdowns
- Geographic distribution
- Listening behavior patterns
- Growth trend analysis
- Platform performance comparison

**Marketing Campaign Tracking:**
- Link click attribution
- Conversion rate monitoring
- Campaign ROI analysis
- A/B testing capabilities
- Performance recommendations

### Fan Engagement Features

**Direct Communication:**
- Fan messaging system
- Newsletter integration
- Exclusive content delivery
- Community building tools
- Feedback collection

**Merchandise Integration:**
- Link to merchandise stores
- Limited edition releases
- Bundle promotions
- Fan club benefits
- Cross-selling opportunities

### Professional Services

**Marketing Consultation:**
- Strategy development sessions
- Campaign planning assistance
- Industry trend insights
- Competitive analysis
- Growth optimization tips

**Playlist Placement Services:**
- Professional playlist placement
- Independent curator relationships
- Genre-specific targeting
- Performance guarantee options
- Detailed reporting

Use these tools consistently to build a sustainable music career!`,
        readTime: "7 min read"
      },
      {
        title: "Collaborating with Other Artists",
        content: "Learn how to set up collaborations, split royalties, and manage multi-artist releases through our platform.",
        fullContent: `# Collaborating with Other Artists

## Managing Multi-Artist Projects and Revenue Sharing

Collaboration is key to growth in the music industry. Our platform makes it easy to work with other artists and manage shared releases.

### Setting Up Collaborations

**Adding Collaborators:**
- Send collaboration invites via email
- Set permission levels (view, edit, admin)
- Define roles and responsibilities
- Establish communication channels
- Document agreements

**Project Management:**
- Shared project dashboards
- File sharing and version control
- Deadline tracking and reminders
- Task assignment and progress
- Approval workflows

### Revenue Splitting Options

**Automatic Split Types:**
- Equal splits (50/50, 33/33/33, etc.)
- Performance-based splits
- Contribution-based percentages
- Custom split arrangements
- Time-based adjustments

**Split Configuration:**
- Primary artist designation
- Featured artist percentages
- Producer and songwriter shares
- Label and publisher splits
- Territory-specific arrangements

### Legal Considerations

**Collaboration Agreements:**
- Written split agreements required
- Copyright ownership clarification
- Credit and billing arrangements
- Future use permissions
- Dispute resolution procedures

**Rights Management:**
- Master recording ownership
- Publishing rights allocation
- Mechanical royalty splits
- Performance rights distribution
- Sync licensing permissions

### Multi-Artist Release Management

**Release Coordination:**
- Synchronized release dates
- Coordinated promotional campaigns
- Shared marketing responsibilities
- Cross-promotion strategies
- Fan base integration

**Credit Management:**
- Primary and featured artist credits
- Producer and writer credits
- Guest musician acknowledgments
- Label and publisher information
- ISRC code management

### Payment Distribution

**Automated Payments:**
- Automatic royalty distribution
- Real-time split calculations
- Transparent reporting for all parties
- Individual tax document generation
- Currency conversion handling

**Payment Tracking:**
- Individual earnings dashboards
- Collaborative project summaries
- Platform performance breakdowns
- Historical payment records
- Dispute resolution support

### Best Practices for Collaboration

**Communication:**
- Regular check-ins and updates
- Clear role definitions
- Shared calendar management
- Decision-making processes
- Conflict resolution strategies

**Creative Process:**
- Version control systems
- Feedback and approval workflows
- Creative credit agreements
- Final approval procedures
- Archive and backup plans

### Managing Collaboration Disputes
1. Refer to original written agreement
2. Use platform mediation services
3. Seek legal counsel if necessary
4. Document all communications
5. Focus on future collaboration health

Successful collaborations can accelerate your music career growth!`,
        readTime: "5 min read"
      }
    ],
    "Technical Support": [
      {
        title: "Troubleshooting Upload Issues",
        content: "Common solutions for upload problems, including file format errors, network issues, and metadata validation failures.",
        fullContent: `# Troubleshooting Upload Issues

## Solving Common Upload Problems

Upload issues can be frustrating, but most problems have simple solutions. Here's how to diagnose and fix common upload problems.

### File Format Issues

**Unsupported Format Errors:**
- Convert files to WAV, FLAC, or MP3
- Check file extension matches actual format
- Avoid proprietary formats (M4P, WMA)
- Use professional audio conversion software
- Verify file isn't corrupted

**Quality Issues:**
- Minimum 44.1kHz/16-bit for WAV files
- 320kbps minimum for MP3 files
- Check for digital clipping or distortion
- Ensure files aren't compressed too heavily
- Test playback before uploading

### Network and Connection Problems

**Slow Upload Speeds:**
- Use wired internet connection when possible
- Close other bandwidth-heavy applications
- Upload during off-peak hours
- Try uploading one file at a time
- Check with your internet service provider

**Connection Timeouts:**
- Refresh browser and try again
- Clear browser cache and cookies
- Try a different browser (Chrome, Firefox, Safari)
- Disable VPN temporarily
- Check firewall settings

### Metadata Validation Errors

**Missing Required Fields:**
- Track title and artist name are mandatory
- Album name required for multi-track releases
- Genre selection cannot be blank
- Release date must be valid
- Check all required fields are filled

**Invalid Characters:**
- Avoid special symbols in titles
- Use standard alphabetic characters
- Remove excessive punctuation
- Check for hidden characters from copy/paste
- Standardize quotation marks

### File Size and Length Limits

**File Too Large:**
- Maximum 500MB per track
- Compress without losing quality
- Check for unnecessary data in file
- Use appropriate bit depth and sample rate
- Contact support for special cases

**Track Too Long:**
- Maximum 30 minutes per track
- Split longer recordings into parts
- Edit out extended silence
- Consider creating separate movements
- Use appropriate tagging for parts

### Artwork Upload Issues

**Image Requirements:**
- Exactly 3000x3000 pixels
- RGB color mode
- JPG or PNG format only
- Maximum 10MB file size
- High quality, no pixelation

**Common Artwork Problems:**
- Image too small or too large
- Wrong color mode (CMYK instead of RGB)
- Copyrighted images
- Low resolution or blurry images
- Text too small to read

### Troubleshooting Steps
1. **Check file specifications** - Format, size, quality
2. **Verify network connection** - Speed and stability
3. **Clear browser data** - Cache, cookies, temporary files
4. **Try different browser** - Chrome, Firefox, Safari, Edge
5. **Contact support** - Include error messages and file details

### Prevention Tips
- Always use high-quality source files
- Maintain consistent naming conventions
- Keep metadata organized and accurate
- Test uploads with smaller files first
- Keep backup copies of all files

Most upload issues can be resolved quickly with these troubleshooting steps!`,
        readTime: "6 min read"
      },
      {
        title: "Platform Integration Problems",
        content: "How to resolve issues with your music not appearing on streaming platforms, delayed distribution, and content ID claims.",
        fullContent: `# Platform Integration Problems

## Resolving Distribution and Streaming Platform Issues

When your music doesn't appear as expected on streaming platforms, these troubleshooting steps will help identify and resolve the issue.

### Music Not Appearing on Platforms

**Timeline Expectations:**
- Spotify, Apple Music: 24-48 hours
- YouTube Music, Amazon: 48-72 hours
- Smaller platforms: Up to 1 week
- Regional platforms: Up to 2 weeks
- Peak periods may cause delays

**Common Causes:**
- Metadata errors or inconsistencies
- Duplicate content detection
- Platform-specific technical issues
- Holiday or high-traffic periods
- Manual review processes

### Delayed Distribution Issues

**Checking Distribution Status:**
- Review your dashboard for status updates
- Look for error messages or warnings
- Check individual platform statuses
- Verify all metadata is complete
- Confirm payment information is current

**Resolution Steps:**
1. Wait for automatic retry (24-48 hours)
2. Check for notification emails
3. Resubmit if status shows "failed"
4. Contact support with release details
5. Provide platform-specific information

### Content ID and Copyright Claims

**Understanding Content ID:**
- Automatic copyright detection system
- Scans audio fingerprints and metadata
- Can flag legitimate releases as duplicates
- Appeals process available
- Usually resolved within 7-14 days

**Resolving False Claims:**
- Gather proof of ownership documentation
- Submit appeal through our system
- Provide original recording evidence
- Include publishing and master rights info
- Be patient during review process

### Platform-Specific Issues

**Spotify Problems:**
- Check Spotify for Artists for status
- Verify artist URI matches
- Ensure playlist submission is complete
- Check for duplicate artist profiles
- Submit for editorial consideration properly

**Apple Music Issues:**
- Confirm iTunes Connect integration
- Check for artwork compliance
- Verify explicit content flags
- Ensure proper territory selection
- Review Apple Music style guidelines

**YouTube Music Complications:**
- Check YouTube Content ID status
- Verify channel ownership
- Ensure proper rights documentation
- Review monetization settings
- Submit copyright forms if needed

### Metadata Synchronization Problems

**Common Sync Issues:**
- Artist name variations across platforms
- Inconsistent album and track titles
- Genre mismatches
- Release date discrepancies
- Credit and contributor differences

**Fixing Sync Problems:**
- Standardize all metadata fields
- Use consistent artist name spelling
- Match album artwork across platforms
- Coordinate release dates
- Update contributor information

### Quality Control Issues

**Audio Quality Problems:**
- Platform rejects low-quality files
- Clipping or distortion detected
- Inappropriate volume levels
- Technical specification violations
- Encoding errors during processing

**Resolution Process:**
- Re-master with proper specifications
- Check for technical issues in source
- Upload higher quality versions
- Contact platform technical support
- Document quality control steps

### Getting Platform Support
- Use official platform support channels
- Provide detailed issue descriptions
- Include relevant documentation
- Reference your distributor (SoundWave)
- Follow up on support tickets

### Prevention Strategies
1. **Double-check metadata** before submission
2. **Use consistent information** across all releases
3. **Monitor platform status** regularly
4. **Keep documentation** of all rights and ownership
5. **Maintain communication** with platform representatives

Most platform integration issues resolve within a few days with proper documentation and patience!`,
        readTime: "8 min read"
      }
    ]
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/support">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Help Center
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find answers to your questions and learn how to make the most of SoundWave
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help articles, guides, and FAQs..."
              className="pl-12 py-4 text-lg bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                  onClick={() => setSelectedCategory(selectedCategory === category.title ? null : category.title)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center transition-all ${selectedCategory === category.title ? 'scale-110' : ''}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="secondary">{category.articles} articles</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {category.description}
                    </CardDescription>
                    {selectedCategory === category.title && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-purple-600 font-medium">
                          ✓ Category selected - showing {category.articles} articles below
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Category Articles */}
        {selectedCategory && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory} Articles
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesByCategory[selectedCategory]?.map((article, index) => (
                <Card key={index} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <BookOpen className="w-6 h-6 text-purple-500 mt-1" />
                      <Badge variant="secondary" className="text-xs">
                        {article.readTime}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {article.content}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => {
                        setSelectedArticle(article);
                      }}
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Popular Articles */}
        {!selectedCategory && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Popular Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {popularArticles.map((article, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-all cursor-pointer hover:scale-102"
                  onClick={() => toggleArticle(article)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        <span className="text-gray-700 hover:text-purple-600 transition-colors">
                          {article}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    {expandedArticles.includes(article) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          This article provides comprehensive information about {article.toLowerCase()}. 
                          Click to read the full guide with step-by-step instructions and best practices.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, this would navigate to the article
                          }}
                        >
                          Read Full Article
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1">
                      {faq.category}
                    </Badge>
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still need help?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              <Link to="/support">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Article Viewer Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedArticle?.title}
            </DialogTitle>
            <DialogDescription className="flex items-center space-x-2">
              <Badge variant="secondary">{selectedArticle?.readTime}</Badge>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">SoundWave Help Center</span>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="prose prose-gray max-w-none">
              {selectedArticle?.fullContent?.split('\n').map((line, index) => {
                // Handle markdown-style formatting
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-6 mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-gray-800 mt-5 mb-3">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold text-gray-700 mt-4 mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-semibold text-gray-900 mt-3 mb-2">{line.substring(2, line.length - 2)}</p>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="text-gray-700 ml-4 mb-1 list-disc">{line.substring(2)}</li>;
                } else if (line.match(/^\d+\./)) {
                  return <li key={index} className="text-gray-700 ml-4 mb-1 list-decimal">{line.substring(line.indexOf('.') + 2)}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else if (line.trim().length > 0) {
                  return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>;
                }
                return null;
              })}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setSelectedArticle(null)} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpCenter;