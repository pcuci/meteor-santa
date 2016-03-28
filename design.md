# Meteor Santa Design

General design constraints:

1. The time required of everyone to use ```meteor santa``` should be dramatically lower than the in-person version of the game to pass the hat around
1. The digital experience should match the real-life "pass the hat around" in-person experience as much as possible which would make the system intuitive to use
1. Should be easy to understand and use by both organizers and participants, and handle exception cases gracefully or completely avoid or pre-emptively point out inconsistent/impossible matching as early as possible
1. 

### Other non-functional requirements:

- Allow for scalability and modularity, don't overdo
- 

## CLI app UX
Imagine one command line interface on a computer, and the computer is passed around for everyone to type in their names and identify who they don't want to receive a present from (the better half).

## Web/mobile app UX
Same as the CLI, with familiar UI components

## Real-time personalized private experience for each participant

Each participant interacts with the hat in their own way, first to put their name in, then to pick a match. They all get annoyed if they need to restart. The validation of the picked name happens at the moment of picking a name from the hat, e.g.: "Is this my wife? Yes. Oh no, we need to start over!"

The host has a different view of the hat, more holistic, and checks to see if the rules are respected, they are the final authority. Other people in the room too double check what's going on, and would presumably notify the host if they notice someone picked a name they shouldn't have. This problem excacebrates itself in huge families where the great-great-grandpa host can't possibly know the state of divorcees, new boyfriends, blood ties or not and undercover amorous relationships not explicitly made public to everyone. For sure, the wife of the host would be more in tune with everyone's affairs and would benefit from advanced priviledges to ensure fair play.

A good solution would **balance the privacy of participants with the need for public disclosure of who's who**. What if someone is in a serious secret relationship with a 2nd degree cousin's ex-husband who is now divorced and therefore legally still part of the family and allowed to participate because they had a child while married?

We therefore challenge the core assumption that the host must know everyone's relationships. Ideally, the system should not know the full picture also; something to consider in a future version.

## Mix god interface with user personalized
It is possible that not everyone in the family has a mobile phone, knows how to use one, can use one, or wants to use techh. Some folks will never adopt technology, but they're still family and want presents; they also give great expensive non-techy gifts, and as such they deserve to play! The best solution would allow trusted others to play on behalf of non-techies.

When participants don't all own phones, the system should gracefully fall to a one "god" UI that can be passed around - like a hat - for everyone to type in their names and retrieve their match. 
