export default function GalleryPage() {
  const galleryImages = [
    {
      src: "/rwanda-children-learning-classroom-education.jpg",
      alt: "Children in classroom learning",
    },
    {
      src: "/women-group-meeting-rwanda-empowerment.jpg",
      alt: "Women's empowerment group meeting",
    },
    {
      src: "/community-gathering-rwanda-village-celebration.jpg",
      alt: "Community gathering and celebration",
    },
    {
      src: "/vocational-training-sewing-rwanda-skills.jpg",
      alt: "Vocational training session",
    },
    {
      src: "/teen-mothers-support-group-rwanda.jpg",
      alt: "Teen mothers support group",
    },
    {
      src: "/agricultural-training-rwanda-farming.jpg",
      alt: "Agricultural training program",
    },
    {
      src: "/children-playing-happy-rwanda-community.jpg",
      alt: "Children playing in community",
    },
    {
      src: "/women-cooperative-business-rwanda-market.jpg",
      alt: "Women's cooperative business",
    },
    {
      src: "/community-leaders-meeting-rwanda-discussion.jpg",
      alt: "Community leaders meeting",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/diverse-community-people-rwanda-hope-gathering.jpgheight=400&width=1920&query=Rwanda+community+people+together+joy)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/70" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FCB20B] mb-4">GALLERY</h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Witness the transformation and impact of our work in communities across Rwanda
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">OUR WORK IN ACTION</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                These images capture the spirit of transformation, hope, and empowerment that defines our mission. Every
                photo tells a story of lives changed and communities strengthened.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <img src={image.src || "/diverse-community-people-rwanda-hope-gathering.jpg"} alt={image.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-background p-4 text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex flex-col items-center mb-6">
                <span className="text-3xl font-bold">ADTS</span>
                <span className="text-lg font-semibold text-primary">RWANDA</span>
              </div>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Changing lives means moving at your heart's rhythm. We're here for creating that. We are here for our
              partners and for the society. We are here to make sure that we give opportunities to change, grow and
              develop. We're here for the people of Rwanda.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              <span>23+ Years of Service</span>
              <span>•</span>
              <span>140K+ People Reached</span>
              <span>•</span>
              <span>86K+ Women Empowered</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
