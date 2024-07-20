import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="space-y-5">
      <p>
        the fastest way to check all my projects is to look through my{" "}
        <a href="https://github.com/brrryry" target="_blank">
          github
        </a>
        , but ngl it is super cluttered so...
      </p>
      <p>heres some cool projects:</p>
      <ul className="list-disc mx-6 space-y-2">
        <li>
          <a
            href="https://github.com/brrryry/osu-beatmap-generator"
            target="_blank"
          >
            osu-beatmap-generator (wip)
          </a>
          <p>
            this personal project is a collaboration with{" "}
            <a href="https://github.com/21dhruvp" target="_blank">
              Dhruv Prasanna
            </a>{" "}
            as we go through a machine learning project related to{" "}
            <a href="https://osu.ppy.sh/" target="_blank">
              a video game we both enjoy
            </a>
            . the goal is to take any song and generate an osu beatmap with
            manually inputted difficulty stats.
          </p>
        </li>
        <li>
          <a href="https://github.com/Dedicated-RAM/brewreview" target="_blank">
            brew review
          </a>
          <p>
            this was a cs554 final project. we used redis, firebase/fireauth and
            nextjs to make a basic website to review coffee shops.
          </p>
        </li>
        <li>
          <a href="https://github.com/JasonQiu21/goodminton" target="_blank">
            goodminton (wip)
          </a>
          <p>
            this was a cs546 final project. we used handlebars and an expressjs
            backend to create a static reservation and tournament site for our
            collegiate badminton club.
          </p>
        </li>
        <li>
          <a href="https://github.com/brrryry/discord-bot" target="_blank">
            discord bot
          </a>
          <p>
            this was a project made with discord.js. it was made for a twitch
            server that i ran at one point, but it is currently deprecated. it
            has a moderation system and a levelling system. it also communicates
            with the twitch and brawlhalla api. maybe ill keep developing it one
            day...
          </p>
        </li>
      </ul>
      <p>heres some other cool projects that cant be linked:</p>
      <ul className="list-disc mx-6 space-y-2">
        <li>
          border gateway protocol research
          <p>
            under the{" "}
            <a
              href="https://caecommunity.org/initiative/insure"
              target="_blank"
            >
              insure+e program
            </a>
            , a couple college students and i worked on research at iowa state
            university. we emperically analyzed the security of current rpki
            infrastructure as well as several other proposed methods of bgp
            security (particularly rov++). a paper might be published soon
            (which means this can go in the linked section, yay). for now, heres
            a link to{" "}
            <a
              href="https://www.linkedin.com/posts/henry-schmidt-40a643173_this-past-month-i-had-the-pleasure-in-participating-activity-7213253221148975104-sAL_?utm_source=share&utm_medium=member_desktop"
              target="_blank"
            >
              one of my partners
            </a>{" "}
            on linkedin...
          </p>
        </li>
      </ul>
    </div>
  );
}
