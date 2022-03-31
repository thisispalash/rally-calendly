## Rally Gatr ![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fthisispalash%2Frally-calendly&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=views&edge_flat=false)
> [Bounty Description](https://gitcoin.co/issue/creatorcointools/calendlygate/1/100027686) | [Github Issue](https://github.com/creatorcointools/calendlygate/issues/1)

Rally Gatr is a web application that allows RallyIO creators to create *gated* events such that only users that own the requisite Creator Coins or Creator NFTs can book timeslots. Creators create these events by specifying the gate type (`token` or `nft`) and the Calendly event to be associated with the gate. General users can see these open events but are forbidden to book time slots if they do not own the required tokens.

This application was built as a submission for the RallyIO bounty on gitcoin (linked above).

## Usage Instructions

When running this application, it is important that you have a Calendly account and a Rally developer account. You will need to create Calendly events on the [Calendly website](https://calendly.com/event_types/user/me). The application pulls these events when creating gated access since there is no way to create new Calendly events programatically.

### Screens

The repository also contains screen recordings for common user flows.

| User Flow | Screen Link |
| :---: | :---: |
| Login and OAuth | |
| Create a new gated event | |
| Schedule a gated event | |
| View your events | |

## Running Locally

In the current state of development, it is best to run this application locally. In other words, this project is still under development and has not been deployed yet. To start, clone this repository by entering `git clone https://github.com/thisispalash/rally-calendly.git` in your terminal or command prompt.

### Prerequisites

For this application to work, you must rename [`.env.template`](.env.template) to `.env` after filling in the incomplete values. There are two external services used by this application and the following steps are required for proper functioning.

#### Rally

1. Create an account on [Rally](https://rally.io/signup/). Note, sign up using email and password.
2. Fill in the value for `RALLY_USERNAME` and `RALLY_PASSWORD` in the environment file, same as the ones used in step 1.
3. Email `developers@rally.io` with the following information using the same email as in step 1.
    - Your name
    - The application name and description
    - The callback url for authentication
4. Add the callback url to your environment file.
5. Wait for a response from Rally before running.

#### Calendly

1. Sign up as a Calendly developer by filling out [this form](https://docs.google.com/forms/d/e/1FAIpQLSc9ltoPU9I_yyQt1gWLm6fa0xMhpPWm-mL_vfPfeilC_s1vTA/viewform) using the same email as your Calendly login.
2. Once you receive your `client_id` and `client_secret` add those to the environment file.
3. Also add the callback url to the environment file.

### Installation

1. Go to the root of the project (where [package.json](package.json) is) and run `npm i` to install dependencies.
2. Run `npm run dev` to start the application in development mode.
3. Navigate to [localhost:5555](http://localhost:5555).

## Room for improvements

The following would be nice to have before deploying this repository.

- [ ] More vibrant UI
- [ ] Light and dark mode
- [ ] Cookies and user memory
- [ ] Quieter user messages
- [ ] Comprehensive test suite

## Future Considerations

The following features can be added to the project in the future to provide a stellar user experience

- [ ] **Booking URLs** Event creators can share this link rather than their Calendly event links for their followers to schedule time with them.
- [ ] **Payment gateway** Users who are gated out can pay for immediate access to the calendar.